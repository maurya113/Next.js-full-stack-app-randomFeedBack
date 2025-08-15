// components/emails/VerificationEmail.tsx

import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

type VerificationEmailProps = {
  username: string;
  otp: string;
};

export const VerificationEmail = ({
  username,
  otp,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Hi {username},</Text>
            <Text style={text}>Your One-Time Password (OTP) is:</Text>
            <Text style={otpText}>{otp}</Text>
            <Text style={text}>
              Please use this OTP to verify your identity. This code is valid
              for a limited time.
            </Text>
            <Text style={footer}>
              If you did not request this, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

// Styling
const main = {
  backgroundColor: "#f9f9f9",
  padding: "40px 0",
  fontFamily: "Helvetica, Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "20px",
  maxWidth: "480px",
  margin: "0 auto",
};

const section = {
  padding: "10px 0",
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const text = {
  fontSize: "14px",
  color: "#333",
  marginBottom: "10px",
};

const otpText = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#1a73e8",
  margin: "20px 0",
  textAlign: "center" as const,
};

const footer = {
  fontSize: "12px",
  color: "#888",
  marginTop: "20px",
};
