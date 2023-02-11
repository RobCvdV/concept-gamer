import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { IconName } from "@fortawesome/free-regular-svg-icons";

type Props = {
  icon: IconDefinition;
};
// regular("coffee")
export const Icon: FC<Props> = ({ icon }) => <FontAwesomeIcon icon={icon} />;
