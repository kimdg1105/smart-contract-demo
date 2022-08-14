import { FC } from "react";
import { Image } from "@chakra-ui/react";

interface SampleCardProps {
    tokenType: string;
}

const SampleCard: FC<SampleCardProps> = ({ tokenType }) => {
    return (
        <Image w={200} h={200} src={`images/${tokenType}.jpg`} alt="SampleCard" />
    );
};

export default SampleCard;