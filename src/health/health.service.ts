/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class HealthService {

    constructor(private llmService: LlmService) { }

    async analyzeLifestyle(data: any) {

        const prompt = `
You are a health risk analysis assistant.

Analyze the user data and return STRICT VALID JSON only.

Format:

{
  "riskScore": number (0-100),
  "riskLevel": "Low" | "Moderate" | "High",
  "summary": string (2 sentence executive summary),
  "keyRisks": string[],
  "suggestions": string[],
  "preventiveAdvice": string[],
  "disclaimer": string
}

Rules:
- Do not include markdown.
- Do not include explanations outside JSON.
- Only return valid JSON.
- This is not medical advice.

User Data:
Age: ${data.age}
Sleep Hours: ${data.sleep}
Daily Steps: ${data.steps}
Water Intake (liters): ${data.water}
Junk Food Frequency per week: ${data.junk}
Stress Level (1-10): ${data.stress}
Exercise Days per week: ${data.exercise}
`;



        const raw = await this.llmService.generateResponse(prompt);

        try {
            const result = JSON.parse(raw);

            let riskColor = 'green';

            if (result.riskScore >= 70) {
                riskColor = 'red';
            } else if (result.riskScore >= 40) {
                riskColor = 'orange';
            }

            console.log('---RESPONSE FROM AI---', result);

            return {
                ...result,
                riskColor
            };

        } catch (error) {
            return {
                error: 'AI response parsing failed',
                rawResponse: raw
            };
        }


    }

    async simplifyReport(data: any) {

        if (!data.report || data.report.trim().length < 5) {
            return { error: 'Invalid or empty lab report text' };
        }

        // 🔒 Safety: limit input size to prevent excessive token usage
        const reportText = data.report.substring(0, 3000);

        const prompt = `
You are a medical lab report simplification engine.

Your task:
- Explain lab values in simple language.
- Identify if values appear Low, Normal, or High.
- Only analyze markers explicitly present in the lab report text.
- Do NOT invent additional lab values.
- Do NOT diagnose diseases.
- Do NOT prescribe medications.
- Only provide educational insights.
- Encourage consulting a healthcare professional.

Return STRICT VALID JSON only.

Format:

{
  "overallAssessment": string,
  "markers": [
    {
      "name": string,
      "value": string,
      "status": "Low" | "Normal" | "High",
      "explanation": string,
      "lifestyleSuggestions": string[]
    }
  ],
  "doctorQuestions": string[],
  "disclaimer": string
}

Lab Report Text:
${reportText}
`;

        const raw = await this.llmService.generateResponse(prompt);

        try {
            const parsed = JSON.parse(raw);

            // 🔎 Count abnormal markers
            const abnormalCount = parsed.markers.filter(
                (m: any) => m.status === 'High' || m.status === 'Low'
            ).length;

            // 🚦 Determine severity level
            let severity = 'Low';

            if (abnormalCount >= 3) {
                severity = 'High';
            } else if (abnormalCount >= 1) {
                severity = 'Moderate';
            }

            return {
                ...parsed,
                abnormalCount,
                severity
            };

        } catch (error) {
            return {
                error: 'AI response parsing failed',
                rawResponse: raw
            };
        }
    }

}
