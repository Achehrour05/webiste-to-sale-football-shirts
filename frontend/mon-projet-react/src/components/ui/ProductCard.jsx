import { Card, CardHeader, CardBody } from "@heroui/react";
import './ProductCard.css';

export default function App(props) {
  return (
    <Card className="cardContainer">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Daily Mix</p>
        <small className="text-default-500">{props.price}</small>
        <h4 className="font-bold text-large">{props.text}</h4>
      </CardHeader>
        <CardBody className="image-container">
          <img
            src={props.img}
            alt="Card background"
            className="product-image"
          />
        </CardBody>
    </Card>
  );
}