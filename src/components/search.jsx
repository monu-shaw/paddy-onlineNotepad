import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  TextField,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

import { useSelector } from "react-redux";
import db from "../firbase";

const SearchPage = () => {
  const loggedStatus = useSelector(e=>e.user.status);
  const user = useSelector(e=>e.user.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user || searchTerm.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const q = query(
          collection(db, "notepad"),
          where("username", "==", user),
          orderBy("createdOn", "desc")
        );
        const querySnapshot = await getDocs(q);

        const filtered = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) =>
            item?.preview?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.data?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.url?.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setResults(filtered);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300); // debounce input

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, user]);

  return (
    <>
      <AppBar position="fixed" color="primary" >
        <Toolbar>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                paddingRight: 0,
              },
            }}
          />
        </Toolbar>
      </AppBar>

      <Toolbar /> {/* Spacer below AppBar */}
      <Container sx={{ mt: 2 }} maxWidth="md">
        {results.length === 0 && searchTerm !== "" ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No results found.
          </Typography>
        ) : (
          <List>
            {results.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemAvatar>
                  <Avatar src={item?.preview?.img || "/placeholder.png"} />
                </ListItemAvatar>
                <ListItemText
                  primary={item?.preview?.title}
                  secondary={item?.data}
                />
                {item.link && (
                  <IconButton
                    edge="end"
                    color="primary"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
