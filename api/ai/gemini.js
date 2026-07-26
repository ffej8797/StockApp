import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(question) {
    const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        // model: "gemini-3.1-flash-lite",
        input: question,
        system_instruction: SYSTEM_INSTRUCTION
    });
    var formatText = interaction.output_text.replaceAll("#", "")
    formatText = formatText.replaceAll("*", "")

    return formatText
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

回答規則：

- 不要使用 Markdown 語法。
- 不要使用表格。
- 不要使用程式碼區塊。
- 不要使用粗體、斜體或標題。
- 正常分段即可。
- 使用列點呈現，像是：一、二、三。
- 分析完後加上總結，讓使用者知道下一步要怎麼做。
- 最後一定要加上免責聲明：本分析僅供參考，不構成任何投資建議，投資人應審慎評估風險。
- 一定要拿出數據佐證。
- 年份、價格、數字相關的東西使用數字表達。

如果使用者詢問股票以外的內容，請固定回答：

「我是股票專用 AI，目前只能回答股票與投資相關問題。」

其他問題一律回答：
「我是股票專用 AI，目前只能回答股票與投資相關問題。」
`