"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, CardActionArea, Container, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SearchTrack = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  console.log(query);
  const [songName, setSongName] = useState<ITrackTop[]>([]);
  console.log("songName ", songName);
  const fetchSearch = async () => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    console.log("res =>>>", res);
    const data = res.data?.result ?? [];
    setSongName(data);
  };

  useEffect(() => {
    document.title = `"${query}" TP`;
    if (query) {
      fetchSearch();
    }
  }, [query]);
  return (
    <Container style={{ margin: "20px 0" }}>
      <div>
        <span>kết quả tìm kiếm từ khóa : {query}</span>
      </div>
      <hr />
      {songName ? (
        songName?.map((item) => {
          return (
            <div style={{ margin: "20px 0 " }} key={item._id}>
              <Link
                href={`/track/${convertSlugUrl(item.title)}-${
                  item._id
                }.html?audio=${item.trackUrl}`}
              >
                <Card
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    textDecoration: "unset",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardContent sx={{ flex: "1 0 auto" }}>
                      <Typography
                        style={{
                          color: "unset",
                          textDecoration: "unset",
                        }}
                        component="div"
                        variant="h5"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        style={{
                          color: "unset",
                          textDecoration: "unset",
                        }}
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Box>
                  <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={`${process.env.NEXT_PUBLIC_BACKEND_URL}images/${item.imgUrl}`}
                    alt="Live from space album cover"
                  />
                </Card>
              </Link>
            </div>
          );
        })
      ) : (
        <div>không tồn tại kết quả tìm kiếm</div>
      )}
    </Container>
  );
};

export default SearchTrack;
