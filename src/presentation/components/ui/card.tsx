import * as React from "react";
import { Card as ChakraCard } from "@chakra-ui/react";

// Make <Card> equivalent to <Card.Root> for backward-compatibility.
export type CardProps = React.ComponentProps<typeof ChakraCard.Root>;

const CardBase = React.forwardRef<HTMLDivElement, CardProps>(
  function CardBase(props, ref) {
    return <ChakraCard.Root ref={ref} {...props} />;
  },
);

CardBase.displayName = "Card";

export const Card = Object.assign(CardBase, {
  Root: ChakraCard.Root,
  Header: ChakraCard.Header,
  Body: ChakraCard.Body,
  Footer: ChakraCard.Footer,
  // Expose any other subcomponents you might need later
});

export default Card;