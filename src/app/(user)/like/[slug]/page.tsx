import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import MyLike from "@/components/myLike/mylike.track";
import { sendRequest } from "@/utils/api";
import { Grid } from "@mui/material";
import { getServerSession } from "next-auth";

const LikePage = async () => {
  const session = await getServerSession(authOptions);

  const resLike = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes?current=1&pageSize=10`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["track-by-like"] },
    },
  });
  console.log(resLike);
  const trackLike = resLike.data?.result ?? [];
  console.log(trackLike);
  return (
    <div>
      <Grid container spacing={2}>
        {trackLike?.map((item, index: number) => {
          return (
            <Grid item xs={12} md={6} key={index}>
              <MyLike content={item} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
export default LikePage;
