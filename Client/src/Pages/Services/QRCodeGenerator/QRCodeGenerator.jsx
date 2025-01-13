import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { ServiceContainer } from '../../../components/ui/serviceContainer';
import {
    Download,
    Upload,
    Settings2,
    Link,
    Image as ImageIcon,
    FileText,
    Sliders,
    AlertCircle
} from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Switch } from '../../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Slider } from "../../../components/ui/slider";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { QRCodeCanvas } from 'qrcode.react';

// QR Code Display Component
const QRDisplay = ({ value, options, logoUrl }) => {
    if (!value) {
        return (
            <div className="flex flex-col items-center text-muted-foreground p-8">
                <AlertCircle className="w-12 h-12 mb-2" />
                <p>Enter content to generate QR code</p>
            </div>
        );
    }

    return (
        <QRCodeCanvas
            value={ value }
            size={ options.size }
            level={ options.errorCorrection }
            fgColor={ options.fgColor }
            bgColor={ options.bgColor }
            imageSettings={
                logoUrl
                    ? {
                        src: logoUrl,
                        width: options.size * 0.2,
                        height: options.size * 0.2,
                        excavate: true,
                    }
                    : undefined
            }
            className="w-full max-w-full h-auto"
        />
    );
};

// Image Upload Component
const ImageUpload = ({ onImageUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageUpload(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-4">
            <Label>Upload Logo (will be centered in QR)</Label>
            <div className="flex items-center gap-2">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={ handleFileChange }
                    className="flex-1"
                />
                <Button variant="outline" onClick={ () => onImageUpload(null) }>
                    Clear
                </Button>
            </div>
        </div>
    );
};

// Style Customization Component
const StyleCustomization = ({ options, setOptions }) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>QR Code Size</Label>
                <Slider
                    min={ 128 }
                    max={ 512 }
                    step={ 32 }
                    value={ [options.size] }
                    onValueChange={ ([size]) => setOptions({ ...options, size }) }
                    className="w-full"
                />
                <div className="text-sm text-muted-foreground">{ options.size }px</div>
            </div>

            <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <div className="flex gap-2">
                    { ['L', 'M', 'Q', 'H'].map((level) => (
                        <Button
                            key={ level }
                            variant={ options.errorCorrection === level ? "default" : "outline" }
                            onClick={ () => setOptions({ ...options, errorCorrection: level }) }
                            className="flex-1"
                        >
                            { level }
                        </Button>
                    )) }
                </div>
            </div>

            <div className="space-y-2">
                <Label>QR Code Color</Label>
                <Input
                    type="color"
                    value={ options.fgColor }
                    onChange={ (e) => setOptions({ ...options, fgColor: e.target.value }) }
                    className="h-10 w-full"
                />
            </div>

            <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                    type="color"
                    value={ options.bgColor }
                    onChange={ (e) => setOptions({ ...options, bgColor: e.target.value }) }
                    className="h-10 w-full"
                />
            </div>
        </div>
    );
};

// Main Component
const QRCodeGenerator = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [content, setContent] = useState('');
    const [qrContent, setQrContent] = useState('');
    const [logoUrl, setLogoUrl] = useState(null);
    const [activeTab, setActiveTab] = useState('url');
    const [showCustomization, setShowCustomization] = useState(false);

    const [options, setOptions] = useState({
        size: 256,
        errorCorrection: 'M',
        fgColor: isDark ? '#ffffff' : '#000000',
        bgColor: isDark ? '#000000' : '#ffffff',
    });

    const generateQR = () => {
        if (!content.trim()) return;
        setQrContent(content.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            generateQR();
        }
    };

    const handleDownload = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        setOptions(prev => ({
            ...prev,
            fgColor: isDark ? '#ffffff' : '#000000',
            bgColor: isDark ? '#000000' : '#ffffff',
        }));
    }, [isDark]);

    return (
        <ServiceContainer>
            <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
                <Tabs value={ activeTab } onValueChange={ setActiveTab }>
                    <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                        <TabsTrigger value="url" className="flex items-center gap-2">
                            <Link className="w-4 h-4" /> URL
                        </TabsTrigger>
                        <TabsTrigger value="text" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Text
                        </TabsTrigger>
                        <TabsTrigger value="image" className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Image
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="url">
                        <Input
                            placeholder="Enter URL to convert to QR code"
                            value={ content }
                            onChange={ (e) => setContent(e.target.value) }
                            onKeyPress={ handleKeyPress }
                        />
                    </TabsContent>

                    <TabsContent value="text">
                        <Input
                            placeholder="Enter text to convert to QR code"
                            value={ content }
                            onChange={ (e) => setContent(e.target.value) }
                            onKeyPress={ handleKeyPress }
                        />
                    </TabsContent>

                    <TabsContent value="image">
                        <Alert>
                            <AlertDescription>
                                Upload an image to generate a QR code that links to it. Note: The image should be hosted somewhere accessible via URL.
                            </AlertDescription>
                        </Alert>
                        <Input
                            placeholder="Enter image URL to convert to QR code"
                            value={ content }
                            onChange={ (e) => setContent(e.target.value) }
                            onKeyPress={ handleKeyPress }
                            className="mt-4"
                        />
                    </TabsContent>
                </Tabs>

                <div className="flex flex-col md:flex-row gap-4">
                    <Button onClick={ generateQR } className="md:w-auto">
                        Generate QR-Code
                    </Button>
                    <Button
                        variant="outline"
                        onClick={ () => setShowCustomization(!showCustomization) }
                        className="flex items-center gap-2"
                    >
                        <Settings2 className="w-4 h-4" />
                        { showCustomization ? 'Hide' : 'Show' } Customization
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div id="qr-code" className="bg-background p-6 rounded-lg border w-full lg:w-auto flex justify-center items-center min-h-[200px]">
                        <QRDisplay
                            value={ qrContent }
                            options={ options }
                            logoUrl={ logoUrl }
                        />
                    </div>

                    { showCustomization && (
                        <div className="space-y-6 w-full lg:w-[300px]">
                            <ImageUpload onImageUpload={ setLogoUrl } />
                            <StyleCustomization options={ options } setOptions={ setOptions } />

                            <Button
                                onClick={ handleDownload }
                                disabled={ !qrContent }
                                className="w-full"
                            >
                                <Download className="mr-2" /> Download QR Code
                            </Button>
                        </div>
                    ) }
                </div>
            </div>
        </ServiceContainer>
    );
};

export default QRCodeGenerator;