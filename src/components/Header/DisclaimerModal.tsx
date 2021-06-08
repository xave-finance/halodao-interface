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
        <TYPE.largeHeader className="header">DISCLAIMER FOR THE USE OF HALODAO WEBAPP AND PROTOCOL</TYPE.largeHeader>
        <TYPE.largeHeader className="header">WARNING!</TYPE.largeHeader>
        <TYPE.body>
          ALL YOU SEE AND ACCESS THROUGH THIS WEBAPP, THE HALODAO GITBOOK AND THE ASSOCIATED HALODAO PROTOCOL IS PURELY
          EXPERIMENTAL AND PROVIDED FOR INFORMATION ONLY.
        </TYPE.body>
        <TYPE.body>
          NO RELIANCE CAN BE PLACED ON ANY INFORMATION CONTENT OR MATERIAL STATED IN THE HALODAO GITBOOK OR THE HAODAO
          PROTOCOL. ACCORDINGLY, YOU MUST VERIFY ALL INFORMATION INDEPENDENTLY BEFORE UTILISING IT AND ALL DECISIONS
          BASED ON INFORMATION CONTAINED ON THIS WEBAPP, THE HALODAO GITBOOK AND THE ASSOCIATED HALODAO PROTOCOL ARE
          YOUR SOLE RESPONSIBILITY AND WE SHALL HAVE NO LIABILITY FOR SUCH DECISIONS.
        </TYPE.body>
        <TYPE.body>
          NOTHING IN THIS DISCLAIMER, ANY INFORMATION CONTENT OR MATERIAL SHALL OR SHALL BE CONSTRUED TO CREATE ANY
          LEGAL RELATIONS BETWEEN US AND YOU NOR GRANT ANY RIGHTS OR OBLIGATIONS TO EITHER OF US.
        </TYPE.body>
        <TYPE.body>USE OF THE HALODAO PROTOCOL MAY RESULT IN COMPLETE AND TOTAL FINANCIAL LOSSES.</TYPE.body>
        <TYPE.mediumHeader className="subhead">CRYPTO AND TECHNOLOGY RISK</TYPE.mediumHeader>
        <TYPE.body>PLEASE DO NOT PROCEED IF YOU ARE UNFAMILIAR, OR DO NOT ACCEPT THE FOLLOWING RISKS:</TYPE.body>
        <TYPE.body>
          INHERENT RISK ASSOCIATED WITH CRYPTOGRAPHIC SYSTEMS, CRYPTOGRAPHIC TOKENS, SMART-CONTRACTS, SMART-CONTRACT
          BASED TOKENS, THE ETHEREUM STANDARD, AND BLOCKCHAIN BASED TECHNOLOGY (“CRYPTO-TECHNOLOGY”) INCLUDING PRICE
          FEEDS OR ORACLES, GOVERNANCE AND ADMINISTRATOR’S KEYS AND BEHAVIOURS (“ASSOCIATED DEFI TECHNOLOGY”);
        </TYPE.body>
        <TYPE.body>
          ADVANCES IN TECHNOLOGY PRESENTS RISKS TO THE INTEGRITY OF CRYPTO-TECHNOLOGY AND UPDATES TO SECURITY PROTOCOLS
          MAY NOT BE SUFFICIENT OR AHEAD OF SUCH ADVANCES AND SUCH CRYPTO-TECHNOLOGY AND ASSOCIATED DEFI TECHNOLOGY MAY
          BE COMPROMISED RESULTING IN LOSSES;
        </TYPE.body>
        <TYPE.body>
          THE USE OF ANY CODE WHETHER IN THE WEBAPP, CRYPTO-TECHNOLOGY, THE HALODAO PROTOCOL OR ASSOCIATED DEFI
          TECHNOLOGY IS SUBJECT TO FLAWS, HUMAN LIMITATIONS AND CAN BE COMPROMISED FURTHER THE PARAMETERS IN THE HALODAO
          PROTOCOL MAY NOT PERFORM AS INTENDED;
        </TYPE.body>
        <TYPE.body>
          CRYPTOCURRENCY AND THE MARKET OF CRYPTOCURRENCY IS A PROGRESSING FIELD AND FACES MANY CHALLENGES NOT LIMITED
          TO HIGH VOLATILITY, LACK OF LIQUIDITY, SPECULATION, TECHNOLOGY AND SECURITY RISKS;
        </TYPE.body>
        <TYPE.body>
          WE OR ANY PROVIDER OF CRYPTO-TECHNOLOGY AND ASSOCIATED DEFI TECHNOLOGY MAY BE IMPACTED BY REGULATORY CHANGES
          BOTH KNOWN AND NOT KNOWN. ANY INQUIRY OR ACTION TAKEN BY A REGULATOR AGAINST US OR A PROVIDER OF
          CRYPTO-TECHNOLOGY WILL PREVENT THE PROVISION OF THIS WEBAPP, THE HALODAO PROTOCOL OR ANY CRYPTO-TECHNOLOGY
          WHICH MAY RESULT IN COMPLETE LOSS TO YOU.
        </TYPE.body>
        <TYPE.mediumHeader className="subhead">DO NOT USE</TYPE.mediumHeader>
        <TYPE.body>
          YOU MUST CONDUCT YOUR OWN RESEARCH AND SATISFY YOURSELF OF YOUR OWN SITUATION, FAMILIARITY AND KNOWLEDGE OF
          CRYPTOCURRENCY AND CODING.
        </TYPE.body>
        <TYPE.body>
          THE HALODAO GITBOOK SETS OUT THE BASIC FRAMEWORK IN WHICH THE HALODAO PROTOCOL IS BEING DEVELOPED ON. PLEASE
          SEE THE HALODAO GITBOOK FOR THE DEVELOPERS CODE USED FOR THE HALODAO PROTOCOL.
        </TYPE.body>
        <TYPE.body>
          YOU MUST SATISFY YOURSELF THAT YOU FULLY UNDERSTAND AND APPRECIATE THE RISKS INVOLVED IN PARTICIPATING IN THIS
          EXPERIMENT.
        </TYPE.body>
        <TYPE.mediumHeader className="subhead">USE AT YOUR OWN RISK</TYPE.mediumHeader>
        <TYPE.body>
          ANY ACTION YOU TAKE UPON THE INFORMATION ON THIS WEBAPP AND THE HALODAO GITBOOK AND ANY ACTION THAT YOU TAKE
          ON THIS WEBAPP OR ON THE HALODAO PROTOCOL IS ENTIRELY AT YOUR OWN RISK.
        </TYPE.body>
        <TYPE.body>
          THIS WEBAPP AND THE HALODAO PROTOCOL MAY BE ILLEGAL FOR USE BY YOU FOR ANY REASON AND YOU MAY FACE CRIMINAL
          PROCEEDINGS OR FINANCIAL PENALTIES FROM THE AUTHORITIES OF THE JURISDICTION THAT YOU ARE RESIDENT OF.
        </TYPE.body>
        <TYPE.mediumHeader className="subhead">USE AS IS - ERRORS AND OMISSIONS</TYPE.mediumHeader>
        <TYPE.body>
          WHILE EVERY EFFORT IS TAKEN TO ENSURE THE ACCURACY OF THE CONTENT IN THE HALODAO GITBOOK, AND THE WORKABILITY
          OF THE HALODAO PROTOCOL, HALODAO FOUNDATION LTD. IS NOT RESPONSIBLE FOR ANY ERRORS OR OMISSIONS THAT MAY BE
          PRESENT IN THE HALODAO GITBOOK AND/OR THE HALODAO PROTOCOL. ALL INFORMATION CONTENT AND FUNCTIONALITY IS
          PROVIDED ON AN “AS-IS” BASIS AND WITHOUT ANY REPRESENTATION OR WARRANTY, WHETHER EXPRESS, IMPLIED OR
          STATUTORY. THERE IS NO GUARANTEE THAT THE USE OF HALODAO PROTOCOL WILL PROVIDE RESULTS DESCRIBED IN THE
          HALODAO GITBOOK OR ANY AT ALL.
        </TYPE.body>
        <TYPE.mediumHeader className="subhead">NO INVESTMENT ADVICE</TYPE.mediumHeader>
        <TYPE.body>
          ANY AND ALL INFORMATION OR CONTENT IN THE HALODAO GITBOOK, THIS WEBAPP OR ANY MATERIAL PROVIDED BY HALODAO IN
          WHATEVER PHRASED OR STATED, IS NOT AND SHOULD NOT BE CONSTRUED AS INVESTMENT ADVICE, FINANCIAL ADVICE, TRADING
          ADVICE, OR ADVICE OF ANY KIND AND YOU SHOULD NOT TREAT ANY OF THE WEBSITE’S CONTENT AS SUCH.
        </TYPE.body>
        <TYPE.body>
          YOU MUST INDEPENDENTLY VERIFY ANY INFORMATION CONTAINED ON THIS WEBAPP, THE HALODAO GITBOOK AND THE ASSOCIATED
          HALODAO PROTOCOL, DO YOUR OWN RESEARCH AND DETERMINE IF YOU ARE SUITABLE TO PARTICIPATE IN THIS EXPERIMENT.
        </TYPE.body>
        <TYPE.mediumHeader className="subhead">NO LIABILITY</TYPE.mediumHeader>
        <TYPE.body>
          IN NO EVENT WILL HALODAO, ITS AFFILIATES, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS OR DIRECTORS (“THE
          INDEMNIFIED PARTIES”) BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN
          CONNECTION WITH YOUR USE OF, OR INABILITY TO USE, THE WEBAPP, ANY WEBSITES LINKED TO IT, OR ANY CONTENT ON THE
          WEBSITE OR SUCH OTHER WEBSITES. THE INDEMNIFIED PARTIES MAKES NO WARRANTY THAT THIS WEBAPP AND THE HALODAO
          PROTOCOL: (I) WILL MEET YOUR REQUIREMENTS; (II) WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; OR (III)
          THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU WILL MEET
          YOUR EXPECTATIONS.
        </TYPE.body>
        <TYPE.body>
          THE INDEMNIFIED PARTIES SHALL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, CONSEQUENTIAL, OR INCIDENTAL DAMAGES
          INCLUDING, WITHOUT LIMITATION, LOST PROFITS OR REVENUES, COSTS OF REPLACEMENT GOODS, LOSS OR DAMAGE TO DATA
          ARISING OUT OF THE USE OR INABILITY TO USE THIS WEBAPP OR ANY PRODUCT OR FUNCTION ASSOCIATED WITH THE HALODAO
          PROTOCOL OR DAMAGES RESULTING FROM USE OF OR RELIANCE ON THE INFORMATION PRESENTED, EVEN IF HALODAO AND THE
          INDEMNIFIED PARTIES HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGES (BECAUSE SOME JURISDICTIONS DO NOT
          ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN CATEGORIES OF DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO YOU.
          IN SUCH JURISDICTIONS, OUR LIABILITY IS LIMITED TO THE FULLEST EXTENT OF THE LAW).
        </TYPE.body>
        <TYPE.body>
          HALODAO AND THE INDEMNIFIED PARTIES WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY A DISTRIBUTED
          DENIAL-OF-SERVICE ATTACK, VIRUSES OR OTHER TECHNOLOGICALLY HARMFUL MATERIAL THAT MAY INFECT YOUR COMPUTER
          EQUIPMENT, COMPUTER PROGRAMS, DATA OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF THE WEBSITE, THE WEBAPP OR
          TO YOUR DOWNLOADING OF ANY MATERIAL POSTED ON IT, OR ON ANY WEBSITE LINKED TO IT.
        </TYPE.body>
      </StyledWrapper>
    </StyledModal>
  )
}

export default DisclaimerModal