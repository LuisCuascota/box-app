import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface CardItemProps {
  image: any;
  title: string;
  description: string;
  primaryButton: string;
  primaryButtonLink: string;
  secondaryButton?: string;
  secondaryButtonLink?: string;
}

export const CardItem = (props: CardItemProps) => {
  const navigate = useNavigate();

  return (
    <Grid size={4}>
      <Card
        sx={(theme) => ({
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 10px 24px rgba(17,43,64,0.12)",
          },
        })}
      >
        <CardMedia
          component="img"
          alt="green iguana"
          height="160"
          image={props.image}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ fontWeight: 700 }}
          >
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(props.primaryButtonLink)}
          >
            {props.primaryButton}
          </Button>
          {props.secondaryButton && props.secondaryButtonLink && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(props.secondaryButtonLink!)}
            >
              {props.secondaryButton}
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};
