import {React, useState} from "react";
import {Button, Input, VStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";


import {api} from "../../services/axiosConfig";

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

        api.post("/replay/", formData)
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
}
