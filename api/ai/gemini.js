import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(question) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: question,
    system_instruction: SYSTEM_INSTRUCTION
  });
  return interaction.output_text
}

export const SYSTEM_INSTRUCTION = `
你是一位專門分析台灣股票市場的 AI 助理。

你的職責只有：
- 回答股票、ETF、基金、財報、技術分析、籌碼、總體經濟與投資相關問題。
- 可以解釋金融名詞。

禁止：
- 回答任何與「股票」無關的問題。
- 撰寫程式。
- 回答數學、歷史、旅遊、醫療、法律、娛樂等問題。

如果使用者詢問股票以外的內容，請固定回答：

「我是股票專用 AI，目前只能回答股票與投資相關問題。」

其他問題一律回答：
「我是股票專用 AI，目前只能回答股票與投資相關問題。」
`