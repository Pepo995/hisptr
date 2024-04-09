import Modal from "@components/Modal";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

const TermsAndConditionsModal = ({ onConfirm, open, setOpen }: Props) => (
  <Modal
    title="HIPSTR TERMS AND CONDITIONS"
    onConfirm={onConfirm}
    acceptText="I Accept"
    cancelText="Close"
    open={open}
    setOpen={setOpen}
    size="lg"
  >
    <div className="tw-max-h-[500px] tw-overflow-auto tw-text-start">
      <p>
        This Agreement between you, (the “Client”), and The Hipstr Company (the “Provider”),
        constitutes the contract under which the Provider will provide equipment under the Hipstr
        Package (as detailed through Provider&apos;s email communication to Client) (collectively
        the “Equipment”) to you for your scheduled event.
      </p>
      <p className="tw-uppercase">
        IT IS IMPORTANT THAT YOU READ CAREFULLY AND UNDERSTAND THIS AGREEMENT. BY CLICKING THE “I
        ACCEPT” BUTTON LOCATED ON THIS PAGE OR BY SIGNING BELOW, YOU AGREE TO BE BOUND BY THIS
        AGREEMENT. IF YOU DO NOT AGREE WITH ALL THE TERMS OF THIS AGREEMENT AND DO NOT AGREE TO BE
        BOUND BY THIS AGREEMENT, PLEASE CLICK THE “I DO NOT ACCEPT” BUTTON OR DO NOT SIGN BELOW. IF
        YOU DO NOT ACCEPT THIS AGREEMENT, YOUR RESERVATION FOR THE HIPSTR PACKAGE WILL BE
        AUTOMATICALLY CANCELLED.
      </p>
      <h4 className="tw-uppercase tw-underline">CANCELLATIONS</h4>
      <p>
        Client acknowledges and agrees that this contract and the usage of the Provider Equipment,
        may be cancelled at any time by submitted written notice of cancellation to{" "}
        <a href="mailto:info@bookhipstr.com">info@bookhipstr.com</a>
      </p>
      <p>
        Client acknowledges and agrees that no refund will be provided for any equipment reservation
        canceled, for any reason including event cancellation, less than six months prior to the
        date of Client&apos;s scheduled reservation and event.
      </p>
      <h4 className="tw-uppercase tw-underline">DAMAGE TO PROVIDER&apos;S EQUIPMENT</h4>
      <p>
        Client acknowledges and agrees that it shall be responsible for any damage or loss to the
        Provider&apos;s Equipment caused by: a) misuse of the Provider&apos;s Equipment by Client,
        its guests, its representatives, or any vendor hired by Client or b) theft while at the
        premises of Client&apos;s event.
      </p>
      <p>
        Client acknowledges and agrees that the Photo Booth Backdrops and Enclosures cannot stand or
        function in winds greater than 10-15mph, and that Provider&apos;s Equipment cannot be
        placed, in the following conditions: in the rain or in a situation where rain is likely,
        with direct strong sunlight on the booth&apos;s touchscreen, under temperatures of 45
        degrees Fahrenheit, or in winds at or exceeding 15mph. In the event of any of these
        conditions, covered or indoor locations must be sought and determined by the Client.
      </p>
      <h4 className="tw-uppercase tw-underline">INDEMNIFICATION</h4>
      <p>Client acknowledges understanding and agreement to the following:</p>
      <p>
        A) Each Party assumes all liability for and agrees to defend, indemnify and hold harmless
        the other Party, its members, officers, directors, employees, agents, representatives,
        successors and assigns (the “Indemnified Parties”) from all claims, fines, damages
        liabilities, losses, costs, expenses (including reasonable attorneys&apos; fees), penalties,
        assessments, and/or injunctive obligations, which may be suffered or incurred at any time by
        the other Party and/or the Indemnified Parties on account of injuries to or death of any
        persons, damage to or destruction of any property, and/or any violation of any applicable
        law, rule, or regulation, caused by, resulting from, or arising, directly or indirectly, out
        of (i) the acts or omissions of the other Party, it&apos;s guests, representatives, or
        vendors, or (ii) any default, breach or violation of this Agreement or any related terms and
        conditions to Provider Equipment usage by Client, it&apos;s guests, representatives, or
        vendors.
      </p>
      <p>
        B) Each Party hereby assumes all liability for and agrees to defend, indemnify and hold
        harmless the other Party, and/or the Indemnified Parties from all claims, fines, damages,
        liabilities, losses, costs, expenses (including reasonable attorneys&apos; fees), penalties,
        assessments, and/or injunctive obligations, which may be suffered of incurred at any time by
        the other Party and/or the Indemnified Parties on account of the usage, dissemination or
        other claim related to the photographs video, or other digital media, taken or created by
        the other Party or through use of the Provider&apos;s Equipment by Client or it&apos;s
        guests, representatives, or vendors.
      </p>
      <h4 className="tw-uppercase tw-underline">USAGE and WARRANTY</h4>
      <p>
        Client acknowledges and agrees that the Provider Equipment is intended only for the purpose
        of producing digital content for entertainment purposes as delineated to be included with
        the Hipstr Package (unless otherwise determined between Client and Provider through email
        communication, which communication, if any, is incorporated herein).
      </p>
      <p>
        Client acknowledges and agrees that Provider makes no warranty of any kind, either express
        or implied, by fact or law, other than those expressly set forth in this Agreement. Client
        acknowledges and agrees that Provider makes no warranty of fitness for a particular purpose
        with respect to the Hipstr Package or the Provider&apos;s Equipment beyond the statement of
        intended purpose, above.
      </p>
      <p>
        Client will not be entitled to any refund if the failure of Provider&apos;s Equipment was in
        any manner caused by the actions or failure to act by the Client, its guests,
        representatives, or vendors.
      </p>
      <p>
        Should Provider&apos;s Equipment fail to perform its required purpose as stated herein,
        Provider may determine a refund considering preparatory expenses Provider incurred to date,
        services rendered, and applicable downtime.
      </p>
      <h4 className="tw-uppercase tw-underline">RIGHTS OF USAGE</h4>
      <p>
        Client acknowledges and agrees that Provider shall, for all time, maintain the right to
        utilize any digital media created by Provider&apos;s Equipment. Client hereby expressly
        provides Provider a license to use such digital content in any form and for any reasonable
        purpose associated with Provider&apos;s business.
      </p>
      <h4 className="tw-uppercase tw-underline">MISCELLANEOUS</h4>
      <p>Client acknowledges and agrees that:</p>
      <p>
        a) The obligations of this Agreement are personal to Client. Client may not assign or
        transfer its rights or obligations under this Agreement without the prior written consent of
        Provider.
      </p>
      <p>
        b) This Agreement shall be governed in accordance with the laws of the State of New York
        without consideration of conflict of law rules. Any dispute arising out of this Agreement
        shall be finally and exclusively settled in the state or federal courts located in New York
        County in the State of New York.
      </p>
      <p>
        c) This Agreement constitutes the entire and exclusive agreement between the parties hereto
        with respect to the subject matter hereof, except where explicitly incorporated herein and
        may only be amended by a writing executed by both parties.
      </p>
      <p>
        d) The use of the singular herein includes the plural and vice versa; the use of the neuter
        includes the masculine and the feminine.
      </p>
      <p>
        e) Notwithstanding anything herein to the contrary, nothing in this Agreement shall be
        deemed or construed to confer any rights of third-party beneficiary on any person.
      </p>
      <p>
        f) By accepting this agreement, the client agrees to allow Hipstr to send them SMS messages
        for the purpose of coordinating their event details, confirming payment, or any other reason
        deemed necessary by Hipstr to ensure satisfactory delivery of Hipstr services.
      </p>
      <p>
        g) Parking - If Client provides parking (free of charge or via voucher) to Provider, and
        Provider is unable to use such parking, Provider reserves the right to charge a parking fee
        of $75.
      </p>
      <p className="tw-uppercase">
        BY CLICKING ON THE “I ACCEPT” BUTTON BELOW OR BY SIGNING BELOW, YOU ACKNOWLEDGE THAT (1)
        YOU, THE CLIENT, HAVE READ AND REVIEWED THIS AGREEMENT IN ITS ENTIRETY, (2) YOU, THE CLIENT,
        AGREE TO BE BOUND BY THIS AGREEMENT, (3) THE INDIVIDUAL SO CLICKING OR SIGNING HAS THE
        POWER, AUTHORITY AND LEGAL RIGHT TO ENTER INTO THIS AGREEMENT ON BEHALF OF YOU, THE CLIENT,
        AND (4) BY SO CLICKING, THIS AGREEMENT CONSTITUTES BINDING AND ENFORCEABLE OBLIGATIONS OF
        YOU, THE CLIENT.
      </p>
    </div>
  </Modal>
);

export default TermsAndConditionsModal;
