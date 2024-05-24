const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
  
    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
  
    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
  
    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
  
    const [errMsg, setErrMsg] = useState("");
    const [succces, setSucces] = useState(false);
  
    useEffect(() => {
      userRef.current.focus();
    }, []);
  
    useEffect(() => {
      const result = USER_REGEX.test(user);
      console.log(user);
      console.log(result);
      setValidName(result);
    }, [user]);
  
    useEffect(() => {
      const result = PWD_REGEX.test(pwd);
      console.log(result);
      console.log(pwd);
      setValidPwd(result);
      const match = pwd === matchPwd;
      setValidMatch(match);
    }, [pwd, matchPwd]);
  
    useEffect(() => {
      setErrMsg("");
    }, [pwd, user, matchPwd]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const v1 = USER_REGEX.test(user);
      const v2 = PWD_REGEX.test(pwd);
      if (!v1 || !v2) {
        setErrMsg("Invalid Entry");
        return;
      }
      try {
        const response = await axios.post(
          REGISTER_URl,
          JSON.stringify({ user, pwd }),
          {
            headers: { "content-type": "application/json" },
            // withCredentials: true,
          }
        );
        console.log(response.data);
        console.log(response.acccesToken);
        console.log(JSON.stringify(response));
      } catch (err) {
        if (!err?.response) {
          setErrMsg("no Server Response");
        } else if (err.response?.status === 409) {
          setErrMsg("USerName Taken");
        } else {
          setErrMsg("Registration Failed");
        }
        errRef.current.focus();
      }
    };
    return (
      <>
        {succces ? (
          <section>
            Success!
            <p>
              <a href="#">Sign-in</a>
            </p>
          </section>
        ) : (
          <div className="main-con">
            <section className="sec-fot">
              <p className={errMsg ? "errmsg" : "offscreen"} ref={errRef}>
                {errMsg}
              </p>
              <h1>Register</h1>
              <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                  UserName:
                  <span className={validName ? "valid" : "hide"}>
                    <IoMdCheckmark />
                  </span>
                  <span className={validName || !user ? "hide" : "invalid"}>
                    <HiOutlineXMark />
                  </span>
                </label>
  
                <input
                  type="text"
                  id="username"
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  required
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  ref={userRef}
                  value={user}
                />
                <p
                  id="uidnote"
                  className={
                    userFocus && user && !validName ? "instructions" : "offscreen"
                  }
                >
                  4 to 24 char.
                  <br />
                  Must begin with a Letter
                  <br />
                  letters ,numbers , underscore , hypnes allowed <br />
                </p>
                <label htmlFor="password">
                  Password:
                  <span className={validPwd ? "valid" : "hide"}>
                    <IoMdCheckmark />
                  </span>
                  <span className={validPwd || !pwd ? "hide" : "invalid"}>
                    <HiOutlineXMark />
                  </span>
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  // value={pwd}
                />
                <p
                  id="pwdnote"
                  className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
                >
                  8 to 24 char.
                  <br />
                  Must include uppercase and lowercase ,
                  <br />
                  a number and special character <br />
                  Allowed Special char:{" "}
                  <span aria-label="exclamation mark">!</span>
                  <span aria-label="at symbol">@</span>
                  <span aria-label="hash tag">#</span>
                  <span aria-label="dollar sign">$</span>
                  <span aria-label="percent">%</span>
                </p>
                <label htmlFor="password">
                  Confirm Password:
                  <span className={validMatch && matchPwd ? "valid" : "hide"}>
                    <IoMdCheckmark />
                  </span>
                  <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                    <HiOutlineXMark />
                  </span>
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                />
                <p
                  id="confirnote"
                  className={
                    matchFocus && !validMatch ? "instructions" : "offscreen"
                  }
                >
                  Must watch the first password input field
                </p>
                <button
                  disabled={!validName || !validPwd || !validMatch ? true : false}
                >
                  Sign Up
                </button>
                <p>
                  Already a Sign-in?
                  <br />
                  {
                    <span className="line">Log-in</span> //Router link
                  }
                </p>
              </form>
            </section>
          </div>
        )}
      </>
    );
  };
  
  export default Register;