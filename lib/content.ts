import raw from "@/content/messages.json";

export type LevelId = "catch" | "boxes" | "memory" | "constellation" | "cake";

export interface Gem {
  title: string;
  text: string;
}

export interface Wish {
  emoji: string;
  title: string;
  text: string;
}

export interface Messages {
  meta: {
    player: string;
    maker: string;
    gameTitle: string;
    subtitle: string;
    mascotName: string;
    domain: string;
  };
  loading: {
    line1: string;
    line2: string;
    envelopeFront: string;
    envelopeBack: string;
  };
  title: {
    heading: string;
    subheading: string;
    startButton: string;
    tagline: string;
  };
  hub: {
    heading: string;
    subheading: string;
    levels: Array<{
      id: number;
      name: string;
      emoji: string;
      blurb: string;
    }>;
    finaleLocked: string;
    finaleUnlocked: string;
  };
  levels: {
    catch: {
      title: string;
      instruction: string;
      timer: number;
      goal: number;
      successMessage: string;
      failMessage: string;
      gem: Gem;
    };
    boxes: {
      title: string;
      instruction: string;
      wishes: Wish[];
      successMessage: string;
      gem: Gem;
    };
    memory: {
      title: string;
      instruction: string;
      successMessage: string;
      gem: Gem;
    };
    constellation: {
      title: string;
      instruction: string;
      successMessage: string;
      gem: Gem;
    };
    cake: {
      title: string;
      instruction: string;
      successMessage: string;
      gem: Gem;
    };
  };
  finale: {
    heading: string;
    body: string[];
    signature: string;
    replay: string;
    secret: string;
  };
  achievements: Record<string, string>;
}

const messages: Messages = raw as Messages;
export default messages;
