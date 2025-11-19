import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createShoppingChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `당신은 'Lumina Market'의 친절하고 세련된 쇼핑 어시스턴트 '루미(Lumi)'입니다. 
      한국어로 대화하며, 고객의 취향에 맞는 제품을 추천하거나 쇼핑몰 이용에 대한 도움을 줍니다.
      
      다음은 우리 쇼핑몰의 대표적인 상품 카테고리입니다:
      - 의류 (트렌디한 패션)
      - 전자제품 (최신 가젯)
      - 홈/리빙 (인테리어 소품)
      - 액세서리 (주얼리 및 잡화)

      고객이 특정 상황(예: 데이트, 집들이 선물, 여행)에 맞는 제품을 물어보면 창의적으로 제안해주세요.
      말투는 정중하면서도 친근하게, 이모지를 적절히 사용하여 생동감 있게 답변하세요.
      `,
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return await chat.sendMessageStream({ message });
};