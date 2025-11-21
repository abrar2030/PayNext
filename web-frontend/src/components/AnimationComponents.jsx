import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Box } from "@mui/material";

// Animation variants for different entrance effects
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Animation component that triggers when element comes into view
const AnimatedElement = ({
  children,
  animation = "fadeInUp",
  delay = 0,
  threshold = 0.1,
  ...props
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold, triggerOnce: true });

  // Select the appropriate animation variant
  const getVariant = () => {
    switch (animation) {
      case "fadeInLeft":
        return fadeInLeft;
      case "fadeInRight":
        return fadeInRight;
      case "fadeIn":
        return fadeIn;
      case "scaleUp":
        return scaleUp;
      case "fadeInUp":
      default:
        return fadeInUp;
    }
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getVariant()}
      style={{ width: "100%" }}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation for lists of items
const StaggeredList = ({ children, staggerDelay = 0.1, ...props }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {React.Children.map(children, (child) => (
        <Box component={motion.div} variants={itemVariants}>
          {child}
        </Box>
      ))}
    </Box>
  );
};

export { AnimatedElement, StaggeredList };
