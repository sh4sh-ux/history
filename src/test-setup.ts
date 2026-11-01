import '@testing-library/jest-dom/vitest';


// jsdom has no layout or scroll implementation. Browser tests exercise the real scroll behavior.
Object.defineProperty(HTMLElement.prototype,'scrollIntoView',{configurable:true,value:()=>{}});
