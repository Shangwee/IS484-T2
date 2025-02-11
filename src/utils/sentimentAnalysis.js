import { data } from "react-router-dom";
import { postData } from "../services/api";

export default function SentimentAnalysis(text) {
    return postData("/sentiment/analyze", text);
}