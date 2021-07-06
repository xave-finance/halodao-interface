import React from 'react'
import { TYPE } from 'theme'
import styled from 'styled-components'
import { ArrowLeft } from 'react-feather'
import { ButtonPrimaryNormal } from 'components/Button'
import { RowFixed } from 'components/Row'

const StyledModal = styled.div`
  width: 100%;
  z-index: 3;
  background: white;
  position: absolute;
`

const StyledWrapper = styled.div`
  width: 1080px;
  max-width: 80%;
  margin: 50px auto;
  color: ${({ theme }) => theme.text4};

  div {
    margin-bottom: 20px;
    color: ${({ theme }) => theme.text4};
  }

  .header {
    font-family: Fredoka One;
  }

  .subhead {
    margin-top: 40px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 90%;
    max-width: 90%;

    .header {
      font-size: 26px;
      font-weight: 500;
    }
  `};

  li {
    margin-bottom: 1rem;
  }
`

interface DisclaimerModalProps {
  onDismiss: () => void
}

const DisclaimerModal = ({ onDismiss }: DisclaimerModalProps) => {
  return (
    <StyledModal>
      <StyledWrapper>
        <RowFixed>
          <ButtonPrimaryNormal size="41px" onClick={onDismiss}>
            <ArrowLeft /> Go Back
          </ButtonPrimaryNormal>
        </RowFixed>
        <TYPE.largeHeader className="header">HaloDAO Terms of Service</TYPE.largeHeader>
        <TYPE.body>Last Revised: July 6, 2021</TYPE.body>
        <TYPE.body>
          Welcome to HaloDAO! The following Terms of Service (“Terms of Service” or “Terms”) apply to all users of
          https://app.halodao.com/ and its associated websites, subdomains, mobile versions, any associated applications
          and services (collectively, the “Site”), which are operated by Open Ocean Sites PTE. LTD. (“<b>HaloDAO</b>,” “
          <b>we</b>” or “<b>us</b>”).
        </TYPE.body>
        <TYPE.body>
          The Terms for the Site represent a legally binding agreement between you, an individual user or a single
          entity (collectively or individually “Users”), and HaloDAO regarding your use of the Site. Together, Users and
          HaloDAO are each referred to herein individually as a “Party” or collectively as the “Parties.” When using the
          Site, you will be subject to any additional posted guidelines or rules applicable to specific services and
          features which may be posted from time to time on the Site (the “Guidelines”). All Guidelines are incorporated
          by reference into these Terms. These Terms apply to all users of the Site, including without limitation, users
          who are browsers, customers, vendors, merchants, and/or contributors of content.
        </TYPE.body>
        <TYPE.body>
          BEFORE USING THE SITE, PLEASE READ THE FOLLOWING TERMS CAREFULLY. BY ACCESSING, BROWSING AND/OR USING THE
          SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THE FOLLOWING TERMS, INCLUDING
          THE GUIDELINES, AND ANY FUTURE MODIFICATIONS. IF AT ANY TIME YOU DO NOT AGREE TO THESE TERMS, PLEASE
          IMMEDIATELY TERMINATE YOUR USE OF THE SITE.{' '}
        </TYPE.body>
        <TYPE.body>
          The HaloDAO Site is provided for informational purposes only, and you should not construe any information or
          other material on the Site as legal, tax, investment, financial or other advice. Nothing contained on our Site
          constitutes a solicitation, recommendation, endorsement or offer by HaloDAO to buy or sell any
          cryptocurrencies or other financial instruments in this or in in any other jurisdiction.
        </TYPE.body>
        <TYPE.body>
          <ol>
            <li>
              <b>Children</b>. You must be the age of Majority or older in your jurisdiction (18 in many jurisdictions;
              older in some) to use the site. [While individuals younger than the age of 18 (but not younger than 13)
              may use the Site, they must do so only with the consent and involvement of a parent or legal guardian,
              under such persons account and otherwise subject to these Terms. HaloDAO does not seek through this Site
              to gather information from or about persons younger than the age of 18.]
            </li>
            <li>
              <b>Privacy Notice</b>. Your privacy is important to HaloDAO. HaloDAO’s Privacy Policy is incorporated into
              these Terms by reference and may be accessed here [Privacy Policy]. Please read the Privacy Policy
              carefully for information relating to HaloDAO’s collection, use and disclosure of information.
            </li>
            <li>
              <b>Modification of the Terms</b>. HaloDAO reserves the right, at our discretion, to change, modify, add or
              remove portions of these Terms at any time for any reason, and we may notify you of such changes through
              any of a variety of means, including a change to the “Last Revised” date set forth above and other
              reasonable means to be determined at our discretion. All changes shall be effective immediately. Please
              check these Terms periodically for changes. Your continued use of the Site after the posting of changes
              constitutes your binding acceptance of such changes.
            </li>
            <li>
              <b>Site Access, Linking</b>. HaloDAO grants you permission to use its Site as set forth in these Terms,
              provided that and for so long as (i) you use the Site solely as expressly permitted herein; (ii) except as
              expressly permitted in these Terms, you do not download, reproduce, redistribute, retransmit, publish,
              resell, distribute, publicly display or otherwise use or exploit any portion of the Site in any medium
              without HaloDAO’s prior written authorization; (iii) you do not alter or modify any part of the Site other
              than as may be reasonably necessary to use the Site for its intended purposes; (iv) you do not engage in
              any of the prohibited uses as described in these Terms; and (v) you otherwise fully comply with these
              Terms. The Site is controlled and offered by HaloDAO from its facilities in Singapore. HaloDAO makes no
              representations that the Site is appropriate or available for use in other locations. If you are accessing
              or using the Site from other jurisdictions, you do so at your own risk, and you are responsible for
              compliance with local laws.
            </li>
            <li>
              <b>Token Distribution Disclaimer</b>. To any and all prospective holders, purchasers, assignees, or
              transferees of the HaloDAO tokens, RNBW ERC-20 (“HaloDAO Tokens”), by your participation in the relevant
              token distribution and interaction with the materials herein and with the HaloDAO Tokens themselves, you
              acknowledge your understanding and agreement with the disclaimers herein:
              <br />
              <br />
              You represent and warrant you are not: (i) in violation of any laws relating to economic sanctions,
              anti-money laundering, or anti-corruption; (ii) restricted or prohibited in dealings by a global sanctions
              authority (including but not limited to the Security Council of the United Nations, the European Union, or
              the U.S. Office of Foreign Assets and Control) (a “Sanctions Authority”), (iii) a citizen of or domiciled
              in a jurisdiction where it would be illegal according to Applicable Law for you to access or use the
              HaloDAO Services or HaloDAO Trading Platform; (iv) a citizen of or domiciled in (at any time) a country
              sanctioned by a Sanctions Authority including, but not limited to, Cuba, Iran, Syria, North Korea, and the
              Crimea region of Ukraine; (iv) located, incorporated or otherwise established in the United States of
              America (including its territories and dependencies, any state of the United States and the District of
              Columbia) and not a “U.S. Person” as defined in Regulation S under the U.S. Securities Act of 1933, as
              amended; or (v) intending to transact with any restricted jurisdiction.
              <br />
              <br />
              HaloDAO has undertaken commercially reasonable screening measures, to the extent possible in a
              distribution performed by a decentralized exchange and accompanying DAO, to prevent any excluded persons
              or jurisdictions from participating in the sale, but as an additional measure relies upon your
              representation that you are not excluded from participation in accord with the foregoing. If HaloDAO
              determines that you are accessing the Services or the Trading Platform from any restricted jurisdiction,
              or have given false representations as to your location of incorporation, establishment, citizenship or
              place of residence, HaloDAO reserves the right to close any of your accounts immediately and liquidate any
              open positions. In addition, You agree that you will not knowingly transfer HaloDAO Tokens to any person
              described in clause (iv) above.
              <br />
              <br />
              “Applicable Law” means all civil and common laws, statutes, subordinate legislation, treaties,
              regulations, directives, decisions, by-laws, ordinances, circulars, codes, orders, notices, demands,
              decrees, injunctions, resolutions, rules and judgments of any government, quasi-government, statutory,
              administrative or regulatory body, court, agency or association by which any member of HaloDAO or you are
              bound in any jurisdiction applicable to the receipt or performance of the Services.
              <br />
              <br />
              ‍“Services” means websites, applications and any services provided by HaloDAO.
              <br />
              <br />
              ‍“Trading Platform” means the trading platform on{' '}
              <a href="https://app.halodao.com">https://app.halodao.com</a> and subdomains, mobile applications, APIs
              and other media relating to the trading platform.
            </li>
            <li>
              <b>Ownership; Proprietary Rights.</b>
              <br />
              General. The Site, including all content, visual interfaces, interactive features, audio, video, digital
              content, information, text, graphics, design, compilation, computer code, software, services, proprietary
              information, copyrights, service marks, trademarks, trade names, distinctive information such as logos,
              the selection, sequence, “look and feel,” arrangement of items, and all other elements of the Site that
              are provided by HaloDAO (“HaloDAO Materials”) are owned and/or licensed by HaloDAO and are legally
              protected, without limitation, under all applicable laws, regulations and treaties. Except as expressly
              authorized by HaloDAO, you agree not to sell, license, distribute, copy, modify, publicly perform or
              display, transmit, publish, edit, adapt, create derivative works from, reverse engineer or disassemble any
              software or otherwise make unauthorized use of the Site or HaloDAO Materials. HaloDAO reserves all rights
              not expressly granted in these Terms. You shall not acquire any right, title or interest to the HaloDAO
              Materials, except for the limited rights expressly set forth in these Terms.
            </li>
            <li>
              <b>Prohibited Uses of the Site.</b>
              <br />
              <br />
              <ol type="a">
                <li>
                  As a condition of your use of the Site, you hereby represent and warrant that you will not use the
                  Site for any purpose that is unlawful or prohibited (including, without limitation, the prohibitions
                  in this Section) by these Terms.
                </li>
                <li>
                  Any use by you of any of the HaloDAO Materials and Site other than for your personal use is strictly
                  prohibited. You agree not to reproduce, duplicate, copy, sell, trade, resell, distribute, or exploit
                  any portion of the Site obtained through the Site, for any purpose other than for your personal use.
                  Any use of the Site other than as expressly permitted herein without our consent is strictly
                  prohibited.
                </li>
                <li>
                  Except as expressly provided in Section 4, you agree not to create derivative works of the Site
                  content, including, without limitation, montages, mash-ups and similar videos, wallpaper, desktop
                  themes, greeting cards or merchandise, unless permitted under these Terms or with the prior written
                  authorization of HaloDAO and any applicable licensors.
                </li>
                <li>
                  You agree not to use the Site if you do not meet the eligibility requirements described in Section 1
                  above.
                </li>
                <li>
                  You agree not to defame, harass, abuse, threaten, stalk or defraud Users of the Site, or collect, or
                  attempt to collect, personal information about Users or third parties without their consent.
                </li>
                <li>
                  You agree not to intentionally interfere with or damage, impair or disable the operation of the Site
                  or any User’s enjoyment of it by any means, including but not limited to uploading or otherwise
                  disseminating viruses, worms, spyware, adware, or other malicious code, or placing a disproportionate
                  load on the Site with the intended result of denying service to other Users.
                </li>
                <li>
                  You agree not to remove, circumvent, disable, damage or otherwise interfere with any security- related
                  features of the Site, features that prevent or restrict the use or copying of any part of the Site, or
                  features that enforce limitations on the use of the Site.
                </li>
                <li>
                  You agree not to attempt to gain unauthorized access to the Site or any part of it, including gaining
                  access or attempting to gain access to another user’s account, computer systems or networks connected
                  to the Site or any part of it, through request, hacking, password mining or any other means or
                  interfere or attempt to interfere with the proper working of the Site or any activities conducted
                  through the Site.
                </li>
                <li>
                  You agree not to obtain or attempt to obtain any materials or information through any means not
                  intentionally made available through the Site. You agree neither to modify the Site in any manner or
                  form nor to use modified versions of the Site, including (without limitation) for the purpose of
                  obtaining unauthorized access to the Site or for the removal of any proprietary notices or labels on
                  the Site.
                </li>
                <li>
                  You agree that you will not use any robot, spider, scraper, or other automated means to access the
                  Site for any purpose without our express prior written permission or bypass our robot exclusion
                  headers or other measures we may use to prevent or restrict access to the Site.
                </li>
                <li>
                  You agree not to use framing techniques to enclose any trademark, logo, or other HaloDAO Materials
                  without our express prior written consent. You agree not to use any meta tags or any other “hidden
                  text” using HaloDAO’s name or trademarks without HaloDAO’s express prior written consent.
                </li>
                <li>
                  You agree not to use any HaloDAO logos, graphics, or trademarks as part of the link without our
                  express prior written consent.
                </li>
                <li>
                  You agree not to sell, rent, lease, distribute, broadcast, sublicense or otherwise assign any right to
                  the Site to any third party.
                </li>
                <li>
                  You agree not to reverse engineer, decompile, disassemble or otherwise attempt to discover the source
                  code of the Site or any part thereof, except and only to the extent that such activity is expressly
                  permitted by applicable law notwithstanding this limitation.
                </li>
                <li>
                  You agree not to use the Site in any manner that could interrupt, damage, disable, overburden or
                  impair the Site, or interfere with any other party’s use and enjoyment of the Site, including, without
                  limitation, sending mass unsolicited messages or “flooding” servers.
                </li>
                <li>
                  You agree not to modify, adapt, translate, or create derivative works based upon the Site or any part
                  thereof, except and only to the extent that such activity is expressly permitted by applicable law
                  notwithstanding this limitation.
                </li>
                <li>
                  You agree not to impersonate another person or entity, or falsely state or otherwise misrepresent your
                  affiliation with a person or entity.
                </li>
                <li>You agree not to use the Site to “stalk” or otherwise harass or harm another in any way.</li>
              </ol>
              <TYPE.body>
                Unauthorized or prohibited use of the Site or the HaloDAO Materials may subject you to civil liability,
                criminal prosecution, or both under federal, state and local laws.
              </TYPE.body>
            </li>
            <li>
              <b>Linking to the Site and Reference Sites.</b>
              <br />
              <br />
              <ol type="a">
                <li>
                  Linking to the Site. You are not permitted to link directly to any image hosted on the Site, such as
                  using an “in-line” linking method to cause the image hosted on the Site to be displayed on another
                  website. You agree not to download or use images hosted on the Site on another website, for any
                  purpose, including, without limitation, posting such images on another website. You agree not to link
                  from any other website in any manner such that the Site, or any page of the Site, is “framed,”
                  surrounded or obfuscated by any third-party content, materials or branding. We reserve all of our
                  rights under the law to insist that any link to the Site be discontinued, and to revoke your right to
                  link to the Site from any other website at any time.
                </li>
                <li>
                  Reference Sites. HaloDAO may provide links on the Site to other websites, including the content
                  therein (“Reference Sites”). HaloDAO has no control over such Reference Sites or their content, and
                  therefore makes no claim or representation regarding, and expressly disclaims responsibility for, the
                  accuracy, quality, legality, nature, availability, or reliability of Reference Sites or other content
                  linked to by the Site. HaloDAO provides links to you only as a convenience, and the inclusion of any
                  link on the Site does not imply our affiliation, endorsement, or adoption of the linked Reference Site
                  or other content or any information therein. If you choose to correspond or engage in transactions
                  with any other person, organization or business found on or through the Site, you acknowledge and
                  agree that we are not a party to, and will not be responsible for, your interaction with such person,
                  organization or business, including its treatment of your information and/or the terms and conditions
                  applicable to any transaction between you and such third-party. You agree that we have no
                  responsibility or liability for any loss or damage of any kind that you may suffer as the result of
                  any such interaction or the presence of such person, organizations or businesses on the Site. ACCESS
                  AND USE OF REFERENCE SITES, INCLUDING THE INFORMATION, CONTENT, MATERIAL, PRODUCTS, AND SERVICES ON
                  REFERENCE SITES OR AVAILABLE THROUGH REFERENCE SITES, IS SOLELY AT YOUR OWN RISK. Our terms and
                  policies do not govern your use of any website other than our Site. You should review applicable terms
                  and policies, including the privacy and data gathering practices, of any Reference Sites.
                </li>
              </ol>
            </li>
            <li>
              <b>Service Availability; Timeliness of Information</b>. HaloDAO may make changes to or discontinue any of
              the HaloDAO Materials, web communities or content available on the Site at any time, and without notice,
              and HaloDAO makes no commitment to update these materials on the Site. This Site may contain certain
              historical information. Historical information, necessarily, is not current and is provided for your
              reference only. We reserve the right to modify the contents of the Site at any time, but we have no
              obligation to update any information on our Site. You agree that it is your responsibility to monitor
              changes to our Site.
            </li>
            <li>
              <b>Service Testing</b>. From time to time, we test various aspects of the Site, including the platform,
              user interfaces, service levels, plans, promotions, features and availability of HaloDAO Materials, and we
              reserve the right to include you in or exclude you from these tests without notice.
            </li>
            <li>
              <b>Feedback</b>. You agree that with respect to any contest or other promotion entries, feedback,
              analysis, suggestions and comments to HaloDAO provided by you (collectively, “Feedback”), IN CONSIDERATION
              OF HALODAO PROVIDING ACCESS TO THE SITE FREE OF CHARGE, USER HEREBY GRANTS TO HALODAO THE EXCLUSIVE
              PERPETUAL, IRREVOCABLE AND WORLDWIDE RIGHT TO USE, COPY, DISPLAY, PERFORM, TRANSLATE, MODIFY, LICENSE,
              SUBLICENSE AND OTHERWISE EXPLOIT ALL OR PART OF THE FEEDBACK OR ANY DERIVATIVE THEREOF IN ANY EMBODIMENT,
              MANNER OR MEDIA NOW KNOWN OR HEREAFTER DEVISED WITHOUT ANY REMUNERATION, COMPENSATION OR CREDIT TO USER.
              User represents and warrants that User has the right to make the foregoing grant to HaloDAO and that any
              Feedback which is provided by User to HaloDAO does not infringe any third-party intellectual property or
              any other rights. Notwithstanding the foregoing, HaloDAO grants to you a non-exclusive, non-transferable,
              non-sublicensable, worldwide, perpetual and irrevocable license to use the Feedback for your own personal,
              non-commercial purposes that do not compete, directly or indirectly, with our use of such Feedback.
            </li>
            <li>
              <b>Termination</b>. These Terms are effective unless and until terminated by either you or us. You may
              terminate these Terms of Service at any time by ceasing use of our Site. You agree that HaloDAO, in its
              sole discretion, may terminate any account (or any part thereof) you may have through the Site or your use
              of the Site, and remove and discard all or any information provided by you. You agree that your access to
              the Site or portion thereof may be terminated without prior notice; and/or accordingly we may deny you
              access to the Site (or any part thereof). You also agree that HaloDAO shall not be liable to you or any
              third-party for any such termination. HaloDAO reserves the right to modify, suspend or discontinue the
              Site and/or access to it at any time and without notice to you, and HaloDAO will not be liable to you
              should it exercise such rights, even if your use of the Site is impacted by the change. These remedies are
              in addition to any other remedies HaloDAO may have at law or in equity.
            </li>
            <li>
              <b>INDEMNIFICATION; HOLD HARMLESS</b>. YOU AGREE TO INDEMNIFY AND HOLD HARMLESS HALODAO AND ITS OFFICERS,
              DIRECTORS, EMPLOYEES, AGENTS AND REPRESENTATIVES FROM ANY AND ALL CLAIMS, LOSSES, OBLIGATIONS, DAMAGES,
              LIABILITIES, COSTS, DEBT, AND EXPENSES (INCLUDING ATTORNEY’S FEES) ARISING OUT OF (I) YOUR USE OR MISUSE
              OF THE SITE; (II) YOUR VIOLATION OF THESE TERMS; (III) YOUR VIOLATION OF THE RIGHTS OF ANY OTHER PERSON OR
              ENTITY; (IV) YOUR BREACH OF THE FOREGOING REPRESENTATIONS, WARRANTIES, AND COVENANTS; AND (V) ANY
              UNAUTHORIZED USE OF THE SITE. HALODAO RESERVES THE RIGHT, AT YOUR EXPENSE, TO ASSUME THE EXCLUSIVE DEFENSE
              AND CONTROL OF ANY MATTER FOR WHICH YOU ARE REQUIRED TO INDEMNIFY US AND YOU AGREE TO COOPERATE WITH OUR
              DEFENSE OF THESE CLAIMS. YOU AGREE NOT TO SETTLE ANY MATTER GIVING RISE TO YOUR INDEMNIFICATION
              OBLIGATIONS WITHOUT THE PRIOR WRITTEN CONSENT OF HALODAO. HALODAO WILL USE REASONABLE EFFORTS TO NOTIFY
              YOU OF ANY SUCH CLAIM, ACTION, OR PROCEEDING UPON BECOMING AWARE OF IT.
            </li>
            <li>
              <b>DISCLAIMERS; NO WARRANTIES.</b>
              <br />
              <br />
              <ol type="A">
                <li>
                  ACKNOWLEDGMENT. YOU EXPRESSLY ACKNOWLEDGE THAT AS USED IN THIS SECTION 14, AND SECTIONS 15 AND 16
                  BELOW, THE TERM HALODAO INCLUDES EACH OF ITS OFFICERS, DIRECTORS, EMPLOYEES, SHAREHOLDERS, MEMBERS,
                  AGENTS AND SUBCONTRACTORS.
                </li>
                <li>
                  NO WARRANTIES. TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, HALODAO DISCLAIMS ALL
                  WARRANTIES, STATUTORY, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
                  MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT
                  OF PROPRIETARY RIGHTS. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM HALODAO
                  OR THROUGH THE SITE, WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED HEREIN.
                </li>
                <li>
                  “AS IS” AND “AS AVAILABLE” AND “WITH ALL FAULTS.” YOU EXPRESSLY AGREE THAT THE USE OF THE SITE IS AT
                  YOUR SOLE RISK. THE SITE AND HALODAO MATERIALS ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE,” “WITH
                  ALL FAULTS” BASIS AND WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </li>
                <li>
                  SITE OPERATION. HALODAO DOES NOT WARRANT THAT THE HALODAO MATERIALS, SITE, OR ANY OTHER INFORMATION
                  OFFERED ON OR THROUGH THE SITE WILL BE UNINTERRUPTED, OR FREE OF ERRORS, HACKING, VIRUSES, OR OTHER
                  HARMFUL COMPONENTS AND DOES NOT WARRANT THAT ANY OF THE FOREGOING WILL BE CORRECTED.
                </li>
                <li>
                  ACCURACY. HALODAO DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE USE OR THE RESULTS OF THE
                  USE OF THE SITE IN TERMS OF CORRECTNESS, ACCURACY, RELIABILITY, OR OTHERWISE.
                </li>
                <li>
                  HARM TO YOUR COMPUTER. YOU UNDERSTAND AND AGREE THAT YOUR USING, ACCESSING, DOWNLOADING, OR OTHERWISE
                  OBTAINING INFORMATION, MATERIALS, OR DATA THROUGH THE SITE (INCLUDING RSS FEEDS) IS AT YOUR OWN
                  DISCRETION AND RISK AND THAT YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR PROPERTY (INCLUDING
                  YOUR COMPUTER SYSTEM) OR LOSS OF DATA THAT RESULTS FROM THE USE OR DOWNLOAD OF, OR OTHER ACCESS TO
                  SUCH MATERIAL OR DATA.
                </li>
              </ol>
            </li>
            <li>
              <b>LIMITATION OF LIABILITY AND DAMAGES.</b>
              <br />
              <br />
              <ol type="A">
                <li>
                  LIMITATION OF LIABILITY. UNDER NO CIRCUMSTANCES, AND UNDER NO LEGAL THEORY, INCLUDING, BUT NOT LIMITED
                  TO, NEGLIGENCE, SHALL HALODAO OR ITS THIRD PARTY COLLABORATORS, LICENSORS OR SUPPLIERS, BE LIABLE FOR
                  PERSONAL INJURY OR ANY SPECIAL, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES (INCLUDING,
                  WITHOUT LIMITATION, LOSS OF PROFITS, BUSINESS INTERRUPTION OR ANY OTHER COMMERCIAL DAMAGES OR LOSS,
                  DATA OR USE OR COST OF COVER) ARISING OUT OF OR RELATING TO THESE TERMS OR THAT RESULT FROM YOUR USE
                  OF, OR THE INABILITY TO USE, THE HALODAO MATERIALS, THE SITE ITSELF, OR ANY OTHER INTERACTIONS WITH
                  HALODAO, EVEN IF HALODAO HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </li>
                <li>
                  LIMITATION OF DAMAGES. IN NO EVENT SHALL HALODAO OR ITS THIRD PARTY COLLABORATORS, LICENSORS OR
                  SUPPLIERS’ TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, AND CAUSES OF ACTION ARISING OUT OF OR
                  RELATING TO THESE TERMS OR YOUR USE OF THE SITE (WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE),
                  WARRANTY, OR OTHERWISE) EXCEED ONE HUNDRED DOLLARS (USD $100).
                </li>
              </ol>
            </li>
            <li>
              <b>LIMITATIONS BY APPLICABLE LAW; BASIS OF THE BARGAIN.</b>
              <br />
              <br />
              <ol type="A">
                <li>
                  LIMITATIONS BY APPLICABLE LAW. CERTAIN JURISDICTIONS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR
                  THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF YOU RESIDE IN SUCH A JURISDICTION, SOME OR ALL OF
                  THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL
                  RIGHTS. THE LIMITATIONS OR EXCLUSIONS OF WARRANTIES, REMEDIES, OR LIABILITY CONTAINED IN THESE TERMS
                  APPLY TO YOU TO THE FULLEST EXTENT SUCH LIMITATIONS OR EXCLUSIONS ARE PERMITTED UNDER THE LAWS OF THE
                  JURISDICTION IN WHICH YOU ARE LOCATED.
                </li>
                <li>
                  BASIS OF THE BARGAIN. YOU ACKNOWLEDGE AND AGREE THAT HALODAO HAS OFFERED ITS CONTENT AND ENTERED INTO
                  THESE TERMS IN RELIANCE UPON THE WARRANTY DISCLAIMERS AND THE LIMITATIONS OF LIABILITY SET FORTH
                  HEREIN, THAT THE WARRANTY DISCLAIMERS AND THE LIMITATIONS OF LIABILITY SET FORTH HEREIN REFLECT A
                  REASONABLE AND FAIR ALLOCATION OF RISK BETWEEN YOU AND HALODAO, AND THAT THE WARRANTY DISCLAIMERS AND
                  THE LIMITATIONS OF LIABILITY SET FORTH HEREIN FORM AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN YOU AND
                  HALODAO. YOU ACKNOWLEDGE AND AGREE THAT HALODAO WOULD NOT BE ABLE TO PROVIDE THE SITE TO YOU ON AN
                  ECONOMICALLY REASONABLE BASIS WITHOUT THESE LIMITATIONS.
                </li>
              </ol>
            </li>
            <li>
              <b>Miscellaneous.</b>
              <br />
              <br />
              <ol type="a">
                <li>
                  Notice. HaloDAO may provide you with notices, including those regarding changes to these Terms, by
                  postings on the Site. You may provide HaloDAO with notices only by email at{' '}
                  <a href="mailto:all@halodao.com">all@halodao.com</a>.
                </li>
                <li>
                  Governing Law. These Terms shall be governed by and construed in accordance with the laws of Singapore
                  without giving effect to any principles of conflicts of law.
                </li>
                <li>
                  Jurisdiction. For any dispute you have with us, you agree to first contact us through email{' '}
                  <a href="mailto:all@halodao.com">all@halodao.com</a> and attempt to resolve the dispute with us
                  informally. If we have not been able to resolve the dispute with you informally, we each agree that
                  any action at law or in equity arising out of or relating to these Terms or the Site shall be filed
                  only in the courts of Singapore and you hereby consent and submit to the personal and exclusive
                  jurisdiction and venue of such courts for the purposes of litigating any such action. IN ANY ACTION OR
                  PROCEEDING COMMENCED TO ENFORCE ANY RIGHT OR OBLIGATION UNDER THIS AGREEMENT, YOUR USE OF THE SITE OR
                  WITH RESPECT TO THE SUBJECT MATTER HEREOF, YOU HEREBY WAIVE ANY RIGHT YOU MAY NOW HAVE OR HEREAFTER
                  POSSESS TO A TRIAL BY JURY.
                </li>
                <li>
                  Claims. YOU AGREE THAT ANY CAUSE OF ACTION BROUGHT BY YOU ARISING OUT OF OR RELATED TO THE SITE MUST
                  COMMENCE WITHIN ONE (1) YEAR AFTER THE CAUSE OF ACTION ACCRUES. OTHERWISE, SUCH CAUSE OF ACTION IS
                  PERMANENTLY BARRED. If, for any reason, we believe, have reason to believe, suspect or are notified of
                  any act, omission or circumstances which may or could (i) compromise or endanger the health,
                  well-being or safety of any person, (ii) cause or lead to damage to persons or property (tangible or
                  intangible), (iii) adversely affect, infringe upon or misappropriate the rights of others, (iv) harass
                  or interfere with any other user or person, firm or enterprise, (v) interfere with or bypass our
                  security or other protective measures applicable to our systems, networks and communications
                  capabilities, (vi) breach or violate these Terms, or (vii) violate any law or regulation, we have the
                  right, reserving cumulatively all other rights and remedies available to us at law, in equity and
                  under this agreement with you, to report and provide information to any and all regulatory and law
                  enforcement authorities and agencies and take any action permitted by law.
                </li>
                <li>
                  Waiver. A provision of these Terms may be waived only by a written instrument executed by the party
                  entitled to the benefit of such provision. The failure of HaloDAO to exercise or enforce any right or
                  provision of these Terms will not constitute a waiver of such right or provision.
                </li>
                <li>
                  Severability. If any provision of these Terms shall be unlawful, void, or for any reason
                  unenforceable, then that provision shall be deemed severable from these Terms and shall not affect the
                  validity and enforceability of any remaining provisions.
                </li>
                <li>
                  Assignment. The Terms and any rights and licenses granted hereunder, may not be transferred or
                  assigned by you, but may be assigned by HaloDAO without restriction. Any assignment attempted to be
                  made in violation of these Terms shall be void.
                </li>
                <li>
                  Headings. The heading references herein are for convenience purposes only, do not constitute a part of
                  these Terms, and shall not be deemed to limit or affect any of the provisions hereof.
                </li>
                <li>
                  Entire Agreement. This is the entire agreement between you and HaloDAO relating to the subject matter
                  herein and supersedes all previous communications, representations, understandings and agreements,
                  either oral or written, between the parties with respect to said subject matter, excluding any other
                  agreements that you may have entered into with HaloDAO. These Terms shall not be modified except in
                  writing, signed by both parties, or by a change to these Terms made by HaloDAO as set forth in Section
                  3 above. All rights not expressly granted in these Terms are reserved to us.
                </li>
              </ol>
            </li>
          </ol>
        </TYPE.body>
        <TYPE.body>
          <i>Copyright © 2021. Open Ocean Sites PTE. LTD. All Rights Reserved.</i>
        </TYPE.body>
      </StyledWrapper>
    </StyledModal>
  )
}

export default DisclaimerModal
