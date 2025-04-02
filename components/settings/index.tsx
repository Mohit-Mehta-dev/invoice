"use client"
import { useCallback, useEffect, useState } from "react"
import { Card, CardBody, Tab, Tabs, Button, Input, Textarea, addToast } from "@heroui/react"
import { FaEdit, FaSave } from "react-icons/fa"
import { getSettings, updateProfile } from "@/services/authService"
import { AddSettings, User, UserSettings } from "@/helpers/types"
import { createAuthLocalStorage, getAuthFromLocalStorage } from "@/utils/localStorageUtils"
import { postSettings } from "@/services/settingsService"
import { AxiosError } from "axios"

type FormData = {
    profile: {
        fullName: string;
        lastName: string;
        companyName: string;
        userName: string;
        mobile: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        pinCode: string;
        state: string;
        email: string;
        gstNumber: string;
        country: string;
    };
    invoice: {
        invPrefix: string;
        companyLogo: string;
        companyTagline: string;
        invoiceNote1: string;
        invoiceNote2: string;
        signature: string;
        signatureName: string;
        signatureDesignation: string;
        primaryColor: string;
        secondaryColor: string;
    };
    banking: {
        bankAccountName: string;
        bankAccountNumber: string;
        bankName: string;
        bankBranch: string;
        accountType: string;
        ifscCode: string;
        gpayNumber: string;
        upiId: string;
        qrCode: File | string;
    };
};

const Settings = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
    const items = ['Profile', 'Invoice', 'Banking']
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        profile: {
            fullName: "",
            lastName: "",
            companyName: "",
            userName: "",
            mobile: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            pinCode: "",
            state: "",
            email: "",
            gstNumber: "",
            country: ""
        },
        invoice: {
            invPrefix: "",
            companyLogo: "",
            companyTagline: "",
            invoiceNote1: "",
            invoiceNote2: "",
            signature: "",
            signatureName: "",
            signatureDesignation: "",
            primaryColor: "#000000",
            secondaryColor: "#FFFFFF"
        },
        banking: {
            bankAccountName: "",
            bankAccountNumber: "",
            bankName: "",
            bankBranch: "",
            accountType: "",
            ifscCode: "",
            gpayNumber: "",
            upiId: "",
            qrCode: ""
        }
    })

    useEffect(() => {
        const storedUser = getAuthFromLocalStorage();
        console.log("Stored user:", storedUser);
        setUser(storedUser ? (storedUser as User) : null);
    }, []);

    useEffect(() => {
        if (user?.id) {
            fetchSettings(user.id);
        }
    }, [user]);

    const fetchSettings = useCallback(async (id: number) => {
        try {
            let response = await getSettings(id);
            setUserSettings(response);
            setFormData({
                profile: {
                    fullName: user?.first_name || "",
                    lastName: user?.last_name || "",
                    companyName: user?.company_name || "",
                    userName: user?.username || "",
                    mobile: user?.phone || "",
                    addressLine1: user?.address_line1 || "",
                    addressLine2: user?.address_line2 || "",
                    city: user?.city || "",
                    pinCode: user?.pincode || "",
                    state: user?.state || "",
                    email: user?.email || "",
                    gstNumber: user?.gst || "",
                    country: user?.country || ""
                },
                invoice: {
                    invPrefix: response.inv_prefix || "",
                    companyLogo: response.logo || "",
                    companyTagline: response.tagline || "",
                    invoiceNote1: response.invoice_notes_1 || "",
                    invoiceNote2: response.invoice_notes_2 || "",
                    signature: response.signature_image || "",
                    signatureName: response.signature_name || "",
                    signatureDesignation: response.signature_designation || "",
                    primaryColor: response.inv_primary_color || "#000000",
                    secondaryColor: response.inv_secondary_color || "#FFFFFF"
                },
                banking: {
                    bankAccountName: response.bank_acc_name || "",
                    bankAccountNumber: response.bank_acc_num || "",
                    bankName: response.bank_name || "",
                    bankBranch: response.bank_branch || "",
                    accountType: response.acc_type || "",
                    ifscCode: response.bank_ifsc_code || "",
                    gpayNumber: response.g_pay || "",
                    upiId: response.upi_pin || "",
                    qrCode: response.qr_code || "",
                }
            });
        } catch (err: unknown) {
            console.log("Login error:", err);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof FormData, field: string) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [section]: {
                ...prevData[section],
                [field]: value
            }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, section: keyof FormData, field: string) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData((prevData) => ({
                    ...prevData,
                    [section]: {
                        ...prevData[section],
                        [field]: e.target.files[0]
                    }
                }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const renderForm = (item: string) => {
        switch (item) {
            case 'Profile':
                return (
                    <>
                        <Input label="Full Name" value={formData.profile.fullName} onChange={(e) => handleInputChange(e, 'profile', 'fullName')} maxLength={40} />
                        <Input label="Last Name" value={formData.profile.lastName} onChange={(e) => handleInputChange(e, 'profile', 'lastName')} maxLength={40} />
                        <Input label="Company Name" value={formData.profile.companyName} onChange={(e) => handleInputChange(e, 'profile', 'companyName') }maxLength={50} />
                        <Input label="UserName" value={formData.profile.userName} onChange={(e) => handleInputChange(e, 'profile', 'userName')} maxLength={40} />
                        <Input label="Mobile" value={formData.profile.mobile} onChange={(e) => handleInputChange(e, 'profile', 'mobile')} maxLength={10}/>
                        <Input label="Address Line1" value={formData.profile.addressLine1} onChange={(e) => handleInputChange(e, 'profile', 'addressLine1')} maxLength={60} />
                        <Input label="Address Line2" value={formData.profile.addressLine2} onChange={(e) => handleInputChange(e, 'profile', 'addressLine2')} maxLength={60}/>
                        <Input label="City" value={formData.profile.city} onChange={(e) => handleInputChange(e, 'profile', 'city')}  maxLength={30}/>
                        <Input label="PIN Code" value={formData.profile.pinCode} onChange={(e) => handleInputChange(e, 'profile', 'pinCode')} maxLength={6} />
                        <Input label="State" value={formData.profile.state} onChange={(e) => handleInputChange(e, 'profile', 'state')} maxLength={30}/>
                        <Input label="Email" value={formData.profile.email} onChange={(e) => handleInputChange(e, 'profile', 'email')} maxLength={40}/>
                        <Input label="GST Number" value={formData.profile.gstNumber} onChange={(e) => handleInputChange(e, 'profile', 'gstNumber')} maxLength={18}/>
                        <Input label="Country" value={formData.profile.country} onChange={(e) => handleInputChange(e, 'profile', 'country')} maxLength={30}/>
                    </>
                )
            case 'Invoice':
                return (
                    <>
                        <Input label="INV Prefix" value={formData.invoice.invPrefix} onChange={(e) => handleInputChange(e, 'invoice', 'invPrefix')} min={2} maxLength={5} />
                        <Input label="Company Logo" type="file" onChange={(e) => handleFileChange(e, 'invoice', 'companyLogo')} />
                        {formData.invoice.companyLogo && <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${formData.invoice.companyLogo}`} alt="Company Logo" className="h-16 w-16 object-cover" />}
                        <Input label="Company Tagline" value={formData.invoice.companyTagline} onChange={(e) => handleInputChange(e, 'invoice', 'companyTagline')} maxLength={50} />
                        <Textarea label="Invoice Note1" value={formData.invoice.invoiceNote1} onChange={(e) => handleInputChange(e, 'invoice', 'invoiceNote1')} maxLength={110} />
                        <Textarea label="Invoice Note2" value={formData.invoice.invoiceNote2} onChange={(e) => handleInputChange(e, 'invoice', 'invoiceNote2')} maxLength={110}/>
                        <Input label="Signature" type="file" onChange={(e) => handleFileChange(e, 'invoice', 'signature')} />
                        {formData.invoice.signature && <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${formData.invoice.signature}`} alt="Signature" className="h-16 w-16 object-cover" />}
                        <Input label="Signature Name" value={formData.invoice.signatureName} onChange={(e) => handleInputChange(e, 'invoice', 'signatureName')} maxLength={40} />
                        <Input label="Signature Designation" value={formData.invoice.signatureDesignation} onChange={(e) => handleInputChange(e, 'invoice', 'signatureDesignation')} maxLength={40}/>
                        <Input label="Primary Color" type="color" value={formData.invoice.primaryColor} onChange={(e) => handleInputChange(e, 'invoice', 'primaryColor')} />
                        <Input label="Secondary Color" type="color" value={formData.invoice.secondaryColor} onChange={(e) => handleInputChange(e, 'invoice', 'secondaryColor')} />
                    </>
                )
            case 'Banking':
                return (
                    <>
                        <Input label="Bank Account Name" value={formData.banking.bankAccountName} onChange={(e) => handleInputChange(e, 'banking', 'bankAccountName')} maxLength={40}/>
                        <Input label="Bank Account Number" value={formData.banking.bankAccountNumber} onChange={(e) => handleInputChange(e, 'banking', 'bankAccountNumber')} maxLength={15}/>
                        <Input label="Bank Name" value={formData.banking.bankName} onChange={(e) => handleInputChange(e, 'banking', 'bankName')} maxLength={50}/>
                        <Input label="Bank Branch" value={formData.banking.bankBranch} onChange={(e) => handleInputChange(e, 'banking', 'bankBranch')} maxLength={50}/>
                        <Input label="Account Type" value={formData.banking.accountType} onChange={(e) => handleInputChange(e, 'banking', 'accountType')} maxLength={20}/>
                        <Input label="IFSC Code" value={formData.banking.ifscCode} onChange={(e) => handleInputChange(e, 'banking', 'ifscCode')} maxLength={15}/>
                        <Input label="Gpay Number" value={formData.banking.gpayNumber} onChange={(e) => handleInputChange(e, 'banking', 'gpayNumber')} maxLength={10}/>
                        <Input label="UPI ID" value={formData.banking.upiId} onChange={(e) => handleInputChange(e, 'banking', 'upiId')} maxLength={35}/>
                        <Input label="QR Code" type="file" onChange={(e) => handleFileChange(e, 'banking', 'qrCode')} />
                        {formData.banking.qrCode && <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${formData.banking.qrCode}`} alt="QR Code" className="h-16 w-16 object-cover" />}
                    </>
                )
            default:
                return null
        }
    }

    const renderData = (item: string) => {
        const data = formData[item.toLowerCase() as keyof FormData]
        return (
            <div className="space-y-2">
                {Object.keys(data).map((key) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-100 rounded-md shadow-sm">
                        <strong className="text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                        {key === 'companyLogo' || key === 'signature' || key === 'qrCode' ? (
                            <img src={`${process.env.NEXT_PUBLIC_BASE_URL}${data[key as keyof typeof data]}`} alt={key} className="h-16 w-16 object-cover" />
                        ) : key === 'primaryColor' || key === 'secondaryColor' ? (
                            <div className="h-6 w-9 " style={{ backgroundColor: data[key as keyof typeof data] }}></div>
                        ) : (
                            <span className="text-gray-900">{data[key as keyof typeof data]}</span>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const handleSettingsSubmit = useCallback(
        async (values: AddSettings) => {
          console.log("Form data submitted:", values);
          if (!user?.id) {
            console.log("User ID is missing");
            return; // Or show an error message
          }
          const formDataToSubmit = {
            acc_type:formData.banking.accountType,
            bank_acc_name:formData.banking.bankAccountName,
            bank_acc_num:formData.banking.bankAccountNumber,
            bank_branch:formData.banking.bankBranch,
            bank_ifsc_code:formData.banking.ifscCode,
            bank_name:formData.banking.bankName,
            g_pay:formData.banking.gpayNumber,
            gst_per_item:formData.profile.gstNumber,
            inv_prefix:formData.invoice.invPrefix,
            inv_primary_color:formData.invoice.primaryColor,
            inv_secondary_color:formData.invoice.secondaryColor,
            invoice_notes_1:formData.invoice.invoiceNote1,
            invoice_notes_2:formData.invoice.invoiceNote2,
            logo:formData.invoice.companyLogo,
            qr_code:formData.banking.qrCode,
            signature_designation:formData.invoice.signatureDesignation,
            signature_image:formData.invoice.signature,
            signature_name:formData.invoice.signatureName,
            tagline:formData.invoice.companyTagline,
            upi_pin:formData.banking.upiId
          };

          // Create a new FormData object
          const newformDataToSubmit = new FormData();

          // Append all non-file fields
          newformDataToSubmit.append("acc_type", formData.banking.accountType);
          newformDataToSubmit.append("bank_acc_name", formData.banking.bankAccountName);
          newformDataToSubmit.append("bank_acc_num", formData.banking.bankAccountNumber);
          newformDataToSubmit.append("bank_branch", formData.banking.bankBranch);
          newformDataToSubmit.append("bank_ifsc_code", formData.banking.ifscCode);
          newformDataToSubmit.append("bank_name", formData.banking.bankName);
          newformDataToSubmit.append("g_pay", formData.banking.gpayNumber);
          newformDataToSubmit.append("gst_per_item", formData.profile.gstNumber);
          newformDataToSubmit.append("inv_prefix", formData.invoice.invPrefix);
          newformDataToSubmit.append("inv_primary_color", formData.invoice.primaryColor);
          newformDataToSubmit.append("inv_secondary_color", formData.invoice.secondaryColor);
          newformDataToSubmit.append("invoice_notes_1", formData.invoice.invoiceNote1);
          newformDataToSubmit.append("invoice_notes_2", formData.invoice.invoiceNote2);
          newformDataToSubmit.append("signature_designation", formData.invoice.signatureDesignation);
          newformDataToSubmit.append("signature_name", formData.invoice.signatureName);
          newformDataToSubmit.append("tagline", formData.invoice.companyTagline);
          newformDataToSubmit.append("upi_pin", formData.banking.upiId);

          // Append file fields (if any)
          if (formData.invoice.companyLogo) {
            newformDataToSubmit.append("logo", formData.invoice.companyLogo);
          }
          if (formData.invoice.signature) {
            newformDataToSubmit.append("signature_image", formData.invoice.signature);
          }
          if (formData.banking.qrCode) {
            newformDataToSubmit.append("qr_code", formData.banking.qrCode);
          }

          
          const profileFormDataToSubmit = new FormData();

          profileFormDataToSubmit.append("first_name", formData.profile.fullName);
          profileFormDataToSubmit.append("last_name", formData.profile.lastName);
          profileFormDataToSubmit.append("company_name", formData.profile.companyName);
          profileFormDataToSubmit.append("username", formData.profile.userName);
          profileFormDataToSubmit.append("phone", formData.profile.mobile);
          profileFormDataToSubmit.append("address_line1", formData.profile.addressLine1);
          profileFormDataToSubmit.append("address_line2", formData.profile.addressLine2);
          profileFormDataToSubmit.append("city", formData.profile.city);
          profileFormDataToSubmit.append("state", formData.profile.state);
          profileFormDataToSubmit.append("pincode", formData.profile.pinCode);
          profileFormDataToSubmit.append("email", formData.profile.email);
          profileFormDataToSubmit.append("gst", formData.profile.gstNumber);
          profileFormDataToSubmit.append("country", formData.profile.country);


          try {
            let response = await postSettings(user.id,newformDataToSubmit);
            console.log("response", response);
            try {
                let response = await updateProfile(profileFormDataToSubmit,user.id,);
                console.log("response", response);
                createAuthLocalStorage(response.user);
                // setCount(prev => prev+1)
              } catch (err: unknown) {
                if (err instanceof AxiosError) {
                    const status = err.response?.status;
                    const message = err.response?.data.message;
              
                    switch (status) {
                      case 400:
                        addToast({
                          title: 'Bad Request',
                          description: String(message),
                          color: 'danger',
                        });
                        break;
                    }}
                console.log("Adding Client error:", err);
              }
            // setCount(prev => prev+1)
          } catch (err: unknown) {
            console.log("Adding Client error:", err);
          }
        },
        [formData, user]
      );

    const handleSubmit = () => {
      console.log("Form data submitted:", formData);
        handleSettingsSubmit(formData as unknown as AddSettings);
        setEditMode(false);
    };

    return (
        <div className="flex flex-col gap-4 m-10 items-center w-full">
            <Tabs aria-label="Tabs colors" color="primary" radius="full" className="w-full">
                {items.map((item) => (
                    <Tab key={item} title={`${item} Details`}>
                        <Card 
                            className="shadow-lg rounded-lg overflow-hidden min-w-[80%] mx-auto"
                            style={{ width: '100%', minWidth: '80%' }}  // This should ensure it's 80% of the parent container
                        >
                            <CardBody className="p-6">
                                <div className="flex justify-center items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">{item} Details</h2>
                                </div>
                                {editMode ? renderForm(item) : renderData(item)}
                                <Button 
                                    onClick={() => editMode ? handleSubmit() : setEditMode(true)} 
                                    className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg"
                                >
                                    {editMode ? <>save</> : <>edit</>}
                                </Button>
                            </CardBody>
                        </Card>
                    </Tab>
                ))}
            </Tabs>
        </div>
    )
}

export default Settings