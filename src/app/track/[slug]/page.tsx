import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";
import { Container } from "@mui/material";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import slugify from "slugify";
const DetailTrackPage = async (props: any) => {
  const { params } = props;
  // console.log("check data", slugify("Phan Tấn Phú", { lower: true }));

  const session = await getServerSession(authOptions);
  // console.log("session", session?.access_token);
  // console.log("params", params);
  // const searchParams = useSearchParams();
  // const search = searchParams.get("audio");
  // console.log("check search>>> ", search);
  // console.log(">>> check console.log props", props);

  const result1 = params.slug.split(".html");
  // console.log(result1);
  const result2 = result1[0]?.split("-");
  // console.log(result2);
  const id = result2[result2.length - 1];
  // console.log(id);
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: ` ${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/${id}`,
    method: "GET",
    nextOption: {
      next: { tags: ["track-by-id"] },
    },
  });
  console.log(res);
  const resComment = await sendRequest<
    IBackendRes<IModelPaginate<ITrackComment>>
  >({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      sort: "-createdAt",
    },
  });
  // const
  const resLike = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/likes?current=1&pageSize=10`,
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

  // console.log("like", resLike);

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
