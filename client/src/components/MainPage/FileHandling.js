import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { address } from '../../variables';
import {
  FileHandlingBox,
  FileWrapper,
  FileAllButton,

} from './StyledComponent';
// import { Link } from 'react-router-dom';

const FileHandling = () => {

  var [FileList, setFileList] = useState([]);
  var body = {"user_pk": localStorage.getItem("user_pk")};

  useEffect(() => {
    const axiosGet = async () => {
      await axios.get(`${address}/getlist`, body).then((res) => {
        setFileList(res);
      });
    };
    axiosGet();
  },[]);

  console.log(body)
  console.log(FileList);

  const FileListElementCreator = ({FileList}) => {

    return(
      <>
        {/* {FileList.entries(File => (
          // <FileWrapper onClick={(e) => fileHandler(File.script_id,e)}>{File.nick_name}</FileWrapper>  
          <FileWrapper>{File.nick_name}</FileWrapper>  
        ))} */}
      </>
    );
  }

  return (
    <>
    <FileHandlingBox>
      <FileListElementCreator FileList={FileList}></FileListElementCreator>
    </FileHandlingBox>
    </>
  );
};

export default FileHandling;
