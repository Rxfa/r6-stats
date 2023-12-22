import { React, useState } from "react";
import { Input, Button, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { axios_instance } from "../../utils/utils";

export function FileUploadFormComponent(){
    const [selectedFiles, setSelectedFiles] = useState([]); 
    const { register, handleSubmit } = useForm();

    const handleFileChange = e => {
        setSelectedFiles(e.target.files);
      };

    const onSubmit = (data) => {
        const formData = new FormData();
    
        for (let i = 0; i < data.files.length; i++) {
            formData.append("files", data.files[i]);
        }

        axios_instance.post("/replay/", formData)
            .then(res => console.log(res))
            .catch(e => console.error("Error uploading files:", e))

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
                <Input type="file" onChange={handleFileChange} multiple />
                <Button type="submit">Upload Files</Button>
            </VStack>
        </form>
    );
};
