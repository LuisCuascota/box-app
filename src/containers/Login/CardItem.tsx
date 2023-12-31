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
    <Grid item xs={12} sm={6} md={4} p={2}>
      <Card>
        <CardMedia
          component="img"
          alt="green iguana"
          height="220"
          image={props.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => navigate(props.primaryButtonLink)}
          >
            {props.primaryButton}
          </Button>
          {props.secondaryButton && props.secondaryButtonLink && (
            <Button
              size="small"
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
