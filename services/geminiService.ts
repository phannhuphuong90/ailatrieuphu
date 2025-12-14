import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là chuyên gia biên tập câu hỏi cho chương trình "Ai Là Triệu Phú" phiên bản giáo dục.
Nhiệm vụ của bạn là tạo ra bộ câu hỏi trắc nghiệm môn Khoa học tự nhiên lớp 6 (phần Hóa học - Chất và sự biến đổi của chất), dựa trên bộ sách Cánh Diều.
Các câu hỏi cần có độ khó tăng dần. Câu 1-5 rất dễ, 6-10 trung bình, 11-15 khó và cần tư duy.
`;

export const generateGameQuestions = async (): Promise<Question[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // We request 15 questions.
    const prompt = `Hãy tạo danh sách đúng 15 câu hỏi trắc nghiệm. 
    Chủ đề: Hóa học lớp 6 (Chất, 3 thể của chất, Oxygen, Không khí, Tách chất ra khỏi hỗn hợp).
    Định dạng JSON. Đảm bảo câu hỏi ngắn gọn, 4 đáp án rõ ràng.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Nội dung câu hỏi" },
              answers: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Danh sách 4 đáp án"
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "Chỉ số của đáp án đúng (0-3)" },
              explanation: { type: Type.STRING, description: "Giải thích ngắn gọn tại sao đáp án đó đúng" }
            },
            required: ["question", "answers", "correctAnswerIndex"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Validate to ensure we have questions
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No data returned");
    }

    return data;

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback questions if API fails or quota exceeded
    return [
      {
        question: "Nước tự nhiên là:",
        answers: ["Một chất tinh khiết", "Một hỗn hợp", "Một nguyên tố", "Một kim loại"],
        correctAnswerIndex: 1,
        explanation: "Nước tự nhiên chứa nhiều chất khoáng hòa tan."
      },
      {
        question: "Tính chất nào sau đây là tính chất hóa học?",
        answers: ["Màu sắc", "Tính dẫn điện", "Khả năng cháy", "Nhiệt độ nóng chảy"],
        correctAnswerIndex: 2
      },
       {
        question: "Để tách muối ăn ra khỏi nước biển, người ta dùng phương pháp nào?",
        answers: ["Lọc", "Lắng", "Cô cạn", "Chưng cất"],
        correctAnswerIndex: 2
      },
       {
        question: "Oxygen chiếm khoảng bao nhiêu phần trăm thể tích không khí?",
        answers: ["21%", "78%", "1%", "50%"],
        correctAnswerIndex: 0
      },
       {
        question: "Chất nào sau đây làm đục nước vôi trong?",
        answers: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
        correctAnswerIndex: 2
      }
    ];
  }
};

export const askAudienceSimulation = async (question: Question): Promise<number[]> => {
   // Simulate audience percentages based on correct answer.
   // Higher chance for correct answer based on simulated "collective intelligence"
   const correctIndex = question.correctAnswerIndex;
   const percentages = [0, 0, 0, 0];
   
   // Randomize slightly but bias towards correct
   let remaining = 100;
   
   // Audience correctness probability (higher implies easier question usually, but simplified here)
   const accuracy = Math.random() * (0.8 - 0.4) + 0.4; // 40-80% audience gets it right
   
   percentages[correctIndex] = Math.floor(remaining * accuracy);
   remaining -= percentages[correctIndex];
   
   // Distribute remaining randomly
   for(let i=0; i<4; i++) {
     if(i !== correctIndex) {
        if (i === 3 && correctIndex !== 3) { // Last one takes all
            percentages[i] = remaining;
        } else {
            const share = Math.floor(Math.random() * remaining);
            percentages[i] = share;
            remaining -= share;
        }
     }
   }
   
   return percentages;
};

export const phoneAFriendSimulation = async (question: Question): Promise<string> => {
    // Simulate a response text
    const friends = ["Bác Học", "Cô Giáo", "Bạn Thân"];
    const friend = friends[Math.floor(Math.random() * friends.length)];
    const letters = ["A", "B", "C", "D"];
    
    // 80% chance friend is right
    const isRight = Math.random() > 0.2;
    const answerIndex = isRight ? question.correctAnswerIndex : Math.floor(Math.random() * 4);
    
    return `${friend} nói: "Theo mình nghĩ thì đáp án đúng là ${letters[answerIndex]}. Mình khá chắc chắn đấy!"`;
};