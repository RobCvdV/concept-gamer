import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React, { FC, ReactNode } from "react";

type Props = FontAwesomeIconProps & {};
export const Icon: FC<Props> = ({ ...props }) => <FontAwesomeIcon {...props} />;
