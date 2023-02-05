import {CSSProperties, FC} from "react";
import {Card} from "react-bootstrap";
import {DateTime} from "luxon";

interface Props {
  msg: string;
  who: string;
  when?: DateTime;
  isMe?: boolean;
}

const style: CSSProperties = {
  backgroundColor: "var(--bs-gray-dark)",
  textAlign: "left",
  fontSize: "14px",
  marginTop: "5px",
};

const styleWho: CSSProperties = {
  display: "flex",
  padding: "0 5px",
  margin: 0,
  textAlign: "left",
  fontSize: "0.8em",
  justifyContent: "space-between",
  backgroundColor: "#00000022",
};

const styleWhen: CSSProperties = {
  textAlign: "right",
  fontSize: "0.9em",
};
const styleMsg: CSSProperties = {
  textAlign: "left",
  fontSize: "1em",
  padding: "0 15px",
};

export const ChatMessageCard: FC<Props> = ({ msg, who, when, isMe }) => {
  // console.log("chat card", msg, who, when);

  const backgroundColor = isMe ? "var(--bs-primary)" : "var(--bs-gray-dark)";

  return (
    <Card className="md" style={{ ...style, backgroundColor }}>
      <Card.Header style={styleWho}>
        {who}
        <span style={styleWhen}>
          {when?.toLocaleString(DateTime.TIME_SIMPLE)}
        </span>
      </Card.Header>
      <Card.Body style={styleMsg}>
        <blockquote className="mb-0">{msg}</blockquote>
      </Card.Body>
    </Card>
  );
};
