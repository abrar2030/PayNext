import React, { useState, useEffect } from "react";
import { userService, simulateApiCall } from "../services/api";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Send as SendIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AttachMoney as AttachMoneyIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  AnimatedElement,
  StaggeredList,
} from "../components/AnimationComponents";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlySpending: 0,
    savedThisMonth: 0,
    pendingTransactions: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Simulate API calls for demo purposes
        const balanceResponse = await simulateApiCall({ balance: 2547.63 });

        const transactionsResponse = await simulateApiCall({
          transactions: [
            {
              id: "tx1",
              type: "incoming",
              amount: 1250.0,
              date: "2025-04-10T14:32:21",
              description: "Salary payment",
              sender: "Acme Corp",
              status: "completed",
            },
            {
              id: "tx2",
              type: "outgoing",
              amount: 42.5,
              date: "2025-04-09T09:15:00",
              description: "Coffee shop",
              recipient: "Starbucks",
              status: "completed",
            },
            {
              id: "tx3",
              type: "outgoing",
              amount: 850.0,
              date: "2025-04-05T18:22:10",
              description: "Rent payment",
              recipient: "Property Management Inc",
              status: "completed",
            },
            {
              id: "tx4",
              type: "incoming",
              amount: 125.0,
              date: "2025-04-03T12:05:45",
              description: "Refund",
              sender: "Amazon",
              status: "completed",
            },
            {
              id: "tx5",
              type: "outgoing",
              amount: 35.99,
              date: "2025-04-01T20:15:30",
              description: "Subscription",
              recipient: "Netflix",
              status: "completed",
            },
          ],
        });

        const statsResponse = await simulateApiCall({
          monthlySpending: 1250.75,
          savedThisMonth: 450.25,
          pendingTransactions: 2,
        });

        setBalance(balanceResponse.data.balance);
        setTransactions(transactionsResponse.data.transactions);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleSendMoney = () => {
    navigate("/send-money");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AnimatedElement>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Dashboard
        </Typography>
      </AnimatedElement>

      <Grid container spacing={4}>
        {/* Balance Card */}
        <Grid item xs={12} md={6} lg={4}>
          <AnimatedElement animation="fadeInUp" delay={0.1}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  Available Balance
                </Typography>
                <IconButton size="small" sx={{ color: "white" }}>
                  <RefreshIcon />
                </IconButton>
              </Box>

              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
                {formatCurrency(balance)}
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SendIcon />}
                  onClick={handleSendMoney}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  Send Money
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 8,
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Add Funds
                </Button>
              </Box>
            </Paper>
          </AnimatedElement>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6} lg={8}>
          <AnimatedElement animation="fadeInUp" delay={0.2}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 3 }}>
                Quick Stats
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "error.light",
                        mb: 1,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <TrendingUpIcon />
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Monthly Spending
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(stats.monthlySpending)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "success.light",
                        mb: 1,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <AttachMoneyIcon />
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Saved This Month
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {formatCurrency(stats.savedThisMonth)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "warning.light",
                        mb: 1,
                        width: 56,
                        height: 56,
                      }}
                    >
                      <HistoryIcon />
                    </Avatar>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Pending Transactions
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {stats.pendingTransactions}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </AnimatedElement>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <AnimatedElement animation="fadeInUp" delay={0.3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                  Recent Transactions
                </Typography>
                <Button endIcon={<HistoryIcon />} size="small">
                  View All
                </Button>
              </Box>

              <StaggeredList staggerDelay={0.1}>
                {transactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    elevation={0}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Avatar
                            sx={{
                              bgcolor:
                                transaction.type === "incoming"
                                  ? "success.light"
                                  : "error.light",
                              width: 40,
                              height: 40,
                            }}
                          >
                            {transaction.type === "incoming" ? (
                              <ArrowDownwardIcon />
                            ) : (
                              <ArrowUpwardIcon />
                            )}
                          </Avatar>
                        </Grid>

                        <Grid item xs>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "medium" }}
                          >
                            {transaction.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.type === "incoming"
                              ? `From: ${transaction.sender}`
                              : `To: ${transaction.recipient}`}
                          </Typography>
                        </Grid>

                        <Grid item>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              color:
                                transaction.type === "incoming"
                                  ? "success.main"
                                  : "error.main",
                            }}
                          >
                            {transaction.type === "incoming" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="right"
                          >
                            {formatDate(transaction.date)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </StaggeredList>
            </Paper>
          </AnimatedElement>
        </Grid>

        {/* Payment Methods */}
        <Grid item xs={12} md={6}>
          <AnimatedElement animation="fadeInLeft" delay={0.4}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 3 }}>
                Payment Methods
              </Typography>

              <List disablePadding>
                <ListItem
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: "primary.light" }}>
                      <CreditCardIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Visa ending in 4242"
                    secondary="Expires 04/2028"
                  />
                  <Chip label="Default" size="small" color="primary" />
                </ListItem>

                <ListItem
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: "secondary.light" }}>
                      <AccountBalanceIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Bank Account"
                    secondary="Chase ****6789"
                  />
                </ListItem>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 8 }}
                  >
                    Add Payment Method
                  </Button>
                </Box>
              </List>
            </Paper>
          </AnimatedElement>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <AnimatedElement animation="fadeInRight" delay={0.5}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 3 }}>
                Quick Actions
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SendIcon />}
                    onClick={handleSendMoney}
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Send Money
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Transaction History
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CreditCardIcon />}
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Manage Cards
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AccountBalanceIcon />}
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Bank Accounts
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </AnimatedElement>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
