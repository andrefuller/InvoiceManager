"use client";
import React from "react";
import { Avatar } from "@mui/material";
import { stringAvatar } from "@/app/utils";
import { CampaignDetails } from "@/types";

interface AvatarRendererProps {
  details: CampaignDetails;
}

const AvatarRenderer: React.FC<AvatarRendererProps> = ({ details }) => {
  return <Avatar data-testid="avatar" {...stringAvatar(details.company)} />;
};

export default AvatarRenderer;
