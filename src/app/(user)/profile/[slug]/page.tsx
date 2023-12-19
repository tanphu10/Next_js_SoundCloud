import { ProfileId } from "@/components/header/app.profile";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";

const profilePage = async ({ params }: { params: { slug: string } }) => {
  console.log(params.slug);
  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop[]>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: { id: params.slug },
    nextOption: {
      next: { tags: ["track-by-profile"] },
    },
  });
  const data = tracks?.data?.result ?? [];
  console.log("tracks =>>>>>>>> kết quả", tracks.data?.result);
  return (
    <Container sx={{ mt: 5 }}>
      <Grid container spacing={2}>
        {data?.map((item, index: number) => {
          return (
            <Grid item xs={12} md={6} key={index}>
              <ProfileId data={item} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default profilePage;
