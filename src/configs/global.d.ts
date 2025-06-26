export {};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'l-bouncy': {
        size?: string;
        stroke?: string;
        speed?: string;
        color?: string;
      };
      'l-hatch': {
        size?: string;
        stroke?: string;
        speed?: string;
        color?: string;
      };
    }
  }
}