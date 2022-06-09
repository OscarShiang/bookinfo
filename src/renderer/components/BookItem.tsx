import { Avatar, Box, Stack, Text, WrapItem } from "@chakra-ui/react";

interface BookItemProp {
    name: string;
    author: string;

    // XXX: average rating maybe?
}

export default function BookItem(props: BookItemProp) {
    return <Box bg='white' w='100%' p={4} borderRadius={10}>
        <Stack direction='row'>
            <WrapItem w='30%'>
                <Avatar name={props.author} size='sm' />
                <Text marginLeft='15px'>{props.author}</Text>
            </WrapItem>
            <Text w='20%' marginLeft='20px' fontSize='lg'>{props.name}</Text>
        </Stack>
    </Box>
}