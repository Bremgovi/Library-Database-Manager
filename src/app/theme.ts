/* theme.ts */
import { extendTheme } from "@chakra-ui/react";
import '@fontsource/source-sans-pro';

export const theme = extendTheme({
    fonts: {
      heading: `'Source Sans Pro', sans-serif`,
      body: `'Source Sans Pro', sans-serif`,
    }
});