import { Badge } from "reactstrap";
import classnames from "classnames";
import { type ReactNode, useState } from "react";
import Image from "next/image";

type AvatarProps = {
  img?: string | false;
  size?: string;
  icon?: ReactNode | null;
  color?: string;
  status?: string;
  badgeUp?: boolean;
  content?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Tag?: any;
  showOnlyInitials?: boolean;
  imgWidth?: number;
  className?: string;
  badgeText?: string;
  imgHeight?: number;
  badgeColor?: string;
  imgClassName?: string;
  contentStyles?: object;
  withBackground?: boolean;
};

const getInitials = (str: string) => {
  const results: string[] = [];
  const wordArray = str.split(" ");
  wordArray.forEach((e) => {
    results.push(e[0]);
  });
  return results.join("");
};

const InitialsBadge = ({
  withBackground,
  badgeUp,
  content,
  showOnlyInitials,
  badgeText,
  badgeColor,
  contentStyles,
  icon,
}: AvatarProps) => {
  return (
    <span
      className={classnames(`avatar-content${withBackground ? " avatar-bg-color" : ""}`, {
        "position-relative": badgeUp,
      })}
      style={contentStyles}
    >
      {showOnlyInitials && content ? getInitials(content) : content}

      {icon ?? null}
      {badgeUp ? (
        <Badge color={badgeColor ? badgeColor : "primary"} className="badge-sm badge-up" pill>
          {badgeText ? badgeText : "0"}
        </Badge>
      ) : null}
    </span>
  );
};

const Avatar = ({
  img,
  size,
  icon,
  color,
  status,
  badgeUp,
  content,
  Tag = "div",
  showOnlyInitials,
  imgWidth,
  className = "",
  badgeText,
  imgHeight,
  badgeColor,
  imgClassName = "",
  contentStyles,
  withBackground = true,
}: AvatarProps) => {
  // ** Function to extract initials from content

  const [fallback, setFallback] = useState(false);

  return (
    <Tag
      className={classnames("avatar", {
        [className]: className,
        [`bg-${color}`]: color,
        [`avatar-${size}`]: size,
      })}
    >
      {!img ? (
        <InitialsBadge
          withBackground={withBackground}
          badgeUp={badgeUp}
          content={content}
          showOnlyInitials={showOnlyInitials}
          badgeText={badgeText}
          badgeColor={badgeColor}
          contentStyles={contentStyles}
          icon={icon}
        />
      ) : (
        <>
          {!fallback ? (
            <Image
              className={classnames({
                [imgClassName]: imgClassName,
              })}
              src={img}
              alt="avatarImg"
              height={imgHeight && !size ? imgHeight : 32}
              width={imgWidth && !size ? imgWidth : 32}
              onError={() => {
                setFallback(true);
              }}
            />
          ) : (
            <InitialsBadge
              withBackground={withBackground}
              badgeUp={badgeUp}
              content={content}
              showOnlyInitials={showOnlyInitials}
              badgeText={badgeText}
              badgeColor={badgeColor}
              contentStyles={contentStyles}
              icon={icon}
            />
          )}
        </>
      )}
      {status ? (
        <span
          className={classnames({
            [`avatar-status-${status}`]: status,
            [`avatar-status-${size}`]: size,
          })}
        ></span>
      ) : null}
    </Tag>
  );
};

export default Avatar;
