// Code inspired from: https://github.com/PinataCloud/pinata-expo-template
import axios from "axios";
import FormData from "form-data";
import { Platform } from "react-native";

const PINATA_API_URL = "https://api.pinata.cloud";

export class PinataService {
	private jwt: string;
	private gatewayUrl: string;

	constructor(jwt: string, gatewayUrl: string) {
		this.jwt = jwt;
		this.gatewayUrl = gatewayUrl;
	}

	private get headers() {
		return {
			Authorization: `Bearer ${this.jwt}`,
		};
	}

	async uploadJSON(data: any) {
		try {
			const response = await axios.post(
				`${PINATA_API_URL}/pinning/pinJSONToIPFS`,
				data,
				{
					headers: {
						...this.headers,
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				},
			);

			return {
				success: true,
				ipfsHash: response.data.IpfsHash,
				pinataUrl: `https://${this.gatewayUrl}/ipfs/${response.data.IpfsHash}`,
			};
		} catch (error) {
			console.error("Pinata upload error:", error);
			if (axios.isAxiosError(error)) {
				console.error("Response data:", error.response?.data);
				console.error("Response status:", error.response?.status);
			}
			throw new Error(
				error instanceof Error ? error.message : "Failed to upload to Pinata",
			);
		}
	}

	async uploadFile(uri: string, filename: string, type: string) {
		try {
			const formData = new FormData();

			if (Platform.OS === "web") {
				// Handle web upload
				const response = await fetch(uri);
				const blob = await response.blob();
				formData.append("file", blob, filename);
			} else {
				// Handle iOS/Android upload
				formData.append("file", {
					uri,
					name: filename,
					type,
				} as any);
			}

			const response = await axios.post(
				`${PINATA_API_URL}/pinning/pinFileToIPFS`,
				formData,
				{
					headers: {
						...this.headers,
						"Content-Type": "multipart/form-data",
						Accept: "application/json",
					},
					transformRequest: (data, headers) => {
						// Return the form data as-is
						return data;
					},
					maxBodyLength: Infinity,
				},
			);

			return {
				success: true,
				ipfsHash: response.data.IpfsHash,
				pinataUrl: `https://${this.gatewayUrl}/ipfs/${response.data.IpfsHash}`,
			};
		} catch (error) {
			console.error("Pinata upload error:", error);
			if (axios.isAxiosError(error)) {
				console.error("Response data:", error.response?.data);
				console.error("Response status:", error.response?.status);
			}
			throw new Error(
				error instanceof Error ? error.message : "Failed to upload to Pinata",
			);
		}
	}
}

export const pinataService = new PinataService(
	process.env.EXPO_PUBLIC_PINATA_JWT || "",
	process.env.EXPO_PUBLIC_GATEWAY_URL || "",
);