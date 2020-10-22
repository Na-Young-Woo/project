import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { addPosting } from "../../_reducers/post_reducer";
import { withRouter } from "react-router-dom";
import Button from "../../components/CustomButtons/Button.js";
import { getLoggedInUser } from "../../helpers/authUtils";
import DropDown from "../../components/DropDown/DropDown";
import Grid from "@material-ui/core/Grid";
import { Cookies } from "react-cookie";
import axios from "axios";

const inputProps = {
  step: 300,
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  form: {
    width: "98%", // Fix IE 11 issue.
    // marginTop: theme.spacing(0),
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: theme.spacing(3),
  },
}));

const titlefont = {
  textAlign: "left",
  paddingLeft: "20px",
  fontSize: "14px",
};

const title01 = {
  fontSize: "12px",
};

const AddTable = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  // const [post, setPost] = useState({
  //   id: null,
  //   header: "",
  //   title: "",
  //   contents: "",
  //   writer: "",
  //   regiDate: "",
  // });

  const [post, setPost] = useState({
    category: "",
    title: "",
    content: "",
  });

  // const id = useSelector((state) => state.posts.slice(-1)[0].id + 1);

  // const loginUser = getLoggedInUser().name;

  // useEffect(() => {
  //   setPost({
  //     ...post,
  //     id: id,
  //     writer: "loginUser",
  //     regiDate: new Date().toLocaleDateString(),
  //   });
  // }, []);

  const [imgPath, setImgPath] = useState(null);

  const onChangeHandler = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const onClickHandler = () => {
    // dispatch(addPosting(post));
    // props.history.push("/admin/table");

    let cookies = new Cookies();
    const userToken = cookies.get("usertoken");

    const formData = new FormData();
    if (imgPath != null) {
      formData.append("img_path", imgPath[0]);
    }
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("category", post.category);

    axios({
      method: "post",
      url: "http://localhost:8000/api/board/",
      data: formData,
      headers: {
        Authorization: `Token	 ${userToken}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log(response);
        alert("등록완료");
        props.history.push("/admin/table");
      })
      .catch(function (response) {
        console.log(response);
        if (post.category == "") {
          alert("카테고리를 지정해주세요.");
        } else if (post.title == "") {
          alert("제목을 입력해주세요.");
        } else if (post.content == "") {
          alert("내용을 입력해주세요");
        } else {
          alert("로그인 후 사용 가능합니다.");
        }
      });
  };

  const onChangeFile = (e) => {
    setImgPath(e.target.files);
  };

  const box1 = {
    // height: "20px",
    fontSize: "10px",
  };

  const box2 = {
    // height: "20px",
    // fontSize: "5px",
    // width: "150px",
    padding: "0 30px 0 0",
  };

  return (
    <form className={classes.root}>
      <div style={box2}>
        <DropDown
          style={title01}
          title="전체"
          value={["Q&A", "여행 TIP", "자유 게시판"]}
          onChange={(value) => setPost({ ...post, category: value })}
        />
        <Grid container spacing={1}>
          <Grid item xs={2} sm={1}>
            <h4 style={titlefont}>제목</h4>
          </Grid>
          <Grid item xs={10} sm={11}>
            <TextField
              name="title"
              label="제목을 입력해주세요."
              multiline
              fullWidth
              size="small"
              value={post.title}
              onChange={(e) => onChangeHandler(e)}
              style={box1}
            />
          </Grid>
          <Grid item xs={2} sm={1}>
            <h4 style={titlefont}>내용</h4>
          </Grid>
          <Grid item xs={10} sm={11}>
            <TextField
              name="content"
              label="내용을 입력해주세요."
              multiline
              fullWidth
              variant="outlined"
              rows={10}
              onChange={(e) => onChangeHandler(e)}
              value={post.contents}
            />
          </Grid>

          <Grid item xs={2} sm={1}>
            <h4 style={titlefont}> 파일 </h4>
          </Grid>
          <Grid item xs={10} sm={11}>
            <TextField
              type="file"
              fullWidth
              variant="outlined"
              onChange={(e) => onChangeFile(e)}
              // style={styles}
            />
          </Grid>
        </Grid>

        <div style={{ float: "right" }}>
          <Button
            style={{ margin: "15px 0 15px 0" }}
            className="write-btn"
            variant="contained"
            color="primary"
            onClick={() => onClickHandler()}
          >
            등록
          </Button>
        </div>
      </div>
    </form>
  );
};

export default withRouter(AddTable);
