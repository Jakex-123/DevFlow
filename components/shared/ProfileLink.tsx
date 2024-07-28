import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProfileProps{
    imgUrl:string,
    href?:string,
    title:string
}

const ProfileLink = ({imgUrl,href,title}:ProfileProps) => {
  return (
    <div className="flex gap-1">
      <Image
        src={imgUrl}
        width={20}
        height={20}
        alt="joined on"
      />
      {href?<Link href={href} target="_blank" className="paragraph-medium text-accent-blue">{title}</Link>:
      <p className="paragraph-medium text-dark400_light700">
        {title}
      </p>}
    </div>
  );
};

export default ProfileLink;
