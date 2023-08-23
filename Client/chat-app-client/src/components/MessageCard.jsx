import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function MessageCard({ msg }) {
  let date = new Date(Number(msg.timestamp));
  date = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Set to 'false' if you want 24-hour format
  });

  let card_color =
    msg.sendername === localStorage.getItem("username") ? "skyblue" : "white";

  console.log("Card color : ", card_color, typeof card_color);
  return (
    <Card
      sx={{
        minWidth: "200px",
        maxWidth: "800px",
        padding: "0px 10px 0px 0px",
        margin: "5px 5px 5px 5px",
        backgroundColor: card_color,
      }}
    >
      <CardContent
        sx={{
          padding: "5px 5px 0px 10px",
        }}
      >
        <div className="message-card-header">
          <Typography sx={{ fontSize: 17 }} color="text.secondary" gutterBottom>
            {msg.sendername}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {date}
          </Typography>
        </div>
        <Typography
          className="message-content"
          variant="p"
          sx={{ fontSize: 19 }}
          component="div"
        >
          {msg.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
