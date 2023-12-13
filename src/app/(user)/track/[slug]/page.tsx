import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  const session = await getServerSession(authOptions);
  console.log("session", session?.access_token);
  // console.log("params", params);
  // const searchParams = useSearchParams();
  // const search = searchParams.get("audio");
  // console.log("check search>>> ", search);
  // console.log(">>> check console.log props", props);
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: ` http://localhost:8000/api/v1/tracks/${params.slug}`,
    method: "GET",
  });
  const resComment = await sendRequest<
    IBackendRes<IModelPaginate<ITrackComment>>
  >({
    url: `http://localhost:8000/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: params.slug,
      sort: "-createdAt",
    },
  });

  // const
  const resLike = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
    url: `http://localhost:8000/api/v1/likes?current=1&pageSize=10`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 100,
      sort: "-createdAt",
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  console.log("like", resLike);

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={resComment?.data?.result ?? []}
          likes={resLike?.data?.result ?? []}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
