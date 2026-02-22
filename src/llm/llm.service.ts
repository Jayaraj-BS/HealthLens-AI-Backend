/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {

    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async generateResponse(prompt: string): Promise<string> {

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a structured health analysis engine. Always return valid JSON only.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
        });


        return completion.choices[0].message.content ?? '';
    }
}
