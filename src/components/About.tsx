import { Button, Typography, Avatar } from "@mui/material"; // MUI components
import LinkedInIcon from "@mui/icons-material/LinkedIn"; // LinkedIn icon
import InstagramIcon from "@mui/icons-material/Instagram"; // Instagram icon
import { motion } from 'framer-motion'

const About = () => {
  const visitInstagram = () => {
    window.location.href = "https://instagram.com/tahirsultanofficial";
  };

  return (
    <div className="aboutSection ">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <motion.div
        className="aboutSectionContainer" >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center mt-10 heading-main "
        >
          <Typography component="h1" fontSize={33} className="heading-about ">About Us</Typography>
        </motion.div>
        <div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://avatars.githubusercontent.com/u/112794262?v=4"
              alt="Founder"
            />
            <Typography>Muhammad Tahir</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is an Mobile E-Commerce Store Build In MERN STACK done by Mohammad
              Tahir. I enjoyed and learned a lot by this project. Feeling Happy
              😉😎🥰.
            </span>
          </motion.div>
          <motion.div
            className="aboutSectionContainer2"
            animate={{ y: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Typography component="h2" >Our Brands</Typography>

            <div className="flex gap-2">
              <a href="https://www.linkedin.com/in/muhammad-tahir-432635351" target="blank">
                <LinkedInIcon className="text-blue-600 linkedInSvgIcon" /> {/* Increased size */}
              </a>

              <a href="https://instagram.com/tahirsultanofficial" target="blank">
                <InstagramIcon className="instagramSvgIcon " /> {/* Increased size */}
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;