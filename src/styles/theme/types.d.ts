import '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    white: string;
    black: string;
    icon: string;
    divider: string;
  }
  interface PaletteOptions {
    white: string;
    black: string;
    icon: string;
    divider: string;
  }
}
