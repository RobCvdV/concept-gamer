import {FC} from "react";
import {Card} from "react-bootstrap";
import {DateTime} from "luxon";

interface Props {
  msg: string;
  who: string;
  when?: DateTime;
}

export const ChatMessageCard: FC<Props> = ({ msg, who, when }) => {
  return (
    <Card style={{ width: "18rem" }}>
      {/*<Card.Img variant="top" src="holder.js/100px180" />*/}
      <Card.Body>
        <Card.Subtitle>{who}</Card.Subtitle>
        <Card.Text>{msg}</Card.Text>
        <Card.Footer>{when?.toLocaleString(DateTime.TIME_SIMPLE)}</Card.Footer>
      </Card.Body>
    </Card>
  );
};
