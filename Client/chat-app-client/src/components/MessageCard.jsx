import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function MessageCard({ msg }) {
  let date = new Date(Number(msg.timestamp));
  date = date.toLocaleTimeString();

  return (
    <Card
      sx={{
        width: "600px",
        margin: "5px 5px 5px 5px",
        backgroundColor: "lightblue",
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 17 }} color="text.secondary" gutterBottom>
          {msg.sendername}
        </Typography>
        <Typography variant="p" sx={{ fontSize: 19 }} component="div">
          {msg.content}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
}
