// dict.d.ts
import { DefineComponent } from 'vue';

export {}

interface Dicts {
  [key: string]: any;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    dicts: Dicts;
  }
}
