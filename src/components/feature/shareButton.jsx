import { ShareOutlined, ShareRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect } from "react";

export const ShareButton = ({ data }) => {
    useEffect(() => {
        console.log(data);
        
    }, []);
  const share = () => {
    if (navigator.share) {
      try {
        navigator.share({
          title: data?.preview ? data?.preview.title : "",
          text: "Check out!",
          url: data?.url,
        });
        console.log("Content shared successfully!");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert(
        "Web Share API not supported on this browser. Try copying the URL manually."
      );
    }
  };
  return (
    <IconButton
      sx={{ fontSize: 20 }}
      edge="start"
      aria-label="share"
      onClick={share}
    >
      <ShareRounded/>
    </IconButton>
  );
};
