import { Stat as ChakraStat } from "@chakra-ui/react";

// Directly re-export Chakra UI's Stat namespace to ensure compatibility
// and avoid type mismatches with internal element refs or subcomponents.
export const Stat = ChakraStat;
export default ChakraStat;
