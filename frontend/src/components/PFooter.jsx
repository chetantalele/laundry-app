import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #194376;
  color: #ffffff;
  padding: 3rem 0 0;
  font-family: 'Arial', sans-serif;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 2rem;
`;

const BrandName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const BrandHighlight = styled.span`
  color: #64b5f6;
  font-weight: bold;
`;

const FooterText = styled.p`
  color: #ffffff;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: #64b5f6;
    transform: translateY(-3px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h4`
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
`;

const ContactInfo = styled.p`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  transition: transform 0.2s ease;
  color: #ffffff;

  &:hover {
    transform: translateX(5px);
  }

  i {
    margin-right: 0.75rem;
    color: #64b5f6;
    width: 16px;
    text-align: center;
  }
`;

const QuickLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuickLink = styled.a`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.2s ease;

  i {
    margin-right: 0.75rem;
    color: #ffffff;
    width: 16px;
    text-align: center;
  }

  &:hover {
    transform: translateX(5px);
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transition: background-color 0.3s ease;

    &::placeholder {
      color: #ffffff;
    }

    &:focus {
      background-color: rgba(255, 255, 255, 0.2);
      outline: none;
    }
  }

  button {
    background-color: #64b5f6;
    color: #194376;
    border: none;
    padding: 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;

    &:hover {
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }
`;

const FooterBottom = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
  padding: 1.5rem 0;
  margin-top: 2rem;

  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: #ffffff;
    }
  }
`;

function PFooter() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <BrandName>
            <BrandHighlight>DRY</BrandHighlight>ME
          </BrandName>
          <FooterText>
            Volup amet magna clita tempor. Tempor sea eos vero ipsum. Lorem lorem
            sit sed elitr sit no, sed kasd et ipsum dolor duo dolor
          </FooterText>
          <SocialIcons>
            <SocialIcon href="#"><i className="fab fa-twitter"></i></SocialIcon>
            <SocialIcon href="#"><i className="fab fa-facebook-f"></i></SocialIcon>
            <SocialIcon href="#"><i className="fab fa-linkedin-in"></i></SocialIcon>
            <SocialIcon href="#"><i className="fab fa-instagram"></i></SocialIcon>
          </SocialIcons>
        </FooterSection>
        <FooterSection>
          <SectionTitle>Get In Touch</SectionTitle>
          <FooterText>Dolor clita stet nonumy clita diam vero, et et ipsum diam labore</FooterText>
          <ContactInfo><i className="fa fa-map-marker-alt"></i>1234 Pune, Maharashtra</ContactInfo>
          <ContactInfo><i className="fa fa-phone-alt"></i>+012 345 67890</ContactInfo>
          <ContactInfo><i className="fa fa-envelope"></i>info@example.com</ContactInfo>
        </FooterSection>
        <FooterSection>
          <SectionTitle>Quick Links</SectionTitle>
          <QuickLinksContainer>
            <QuickLink href="#"><i className="fa fa-angle-right"></i>Home</QuickLink>
            <QuickLink href="#"><i className="fa fa-angle-right"></i>About Us</QuickLink>
            <QuickLink href="/service-provider/add-service"><i className="fa fa-angle-right"></i>Add Services</QuickLink>
            <QuickLink href="/service-provider/orders"><i className="fa fa-angle-right"></i>Orders Received</QuickLink>
          </QuickLinksContainer>
        </FooterSection>
        <FooterSection>
          <SectionTitle>Newsletter</SectionTitle>
          <NewsletterForm>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <button type="submit">Submit Now</button>
          </NewsletterForm>
        </FooterSection>
      </FooterContent>
      <FooterBottom>
        <p>&copy; <a href="#">DRY ME</a>. All Rights Reserved. Designed Prathamesh & Team</p>
      </FooterBottom>
    </FooterContainer>
  );
}

export default PFooter;