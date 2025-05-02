import { Grid, Card, CardContent, Skeleton } from "@mui/material"

const CountryListSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <Card sx={{ height: "100%" }}>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
              <Skeleton variant="text" height={32} width="75%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={20} width="50%" sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width="65%" sx={{ mb: 0.5 }} />
              <Skeleton variant="text" height={20} width="40%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default CountryListSkeleton